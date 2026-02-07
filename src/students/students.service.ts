import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async createPreEnrollment(dto: CreateEnrollmentDto, schoolId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Criar ou Buscar Estudante (usando Upsert para evitar duplicar pelo WhatsApp)
      const student = await tx.student.upsert({
        where: { whatsappNumber: dto.whatsappNumber || 'TEMP-' + Date.now() },
        update: { name: dto.name }, // Atualiza o nome se o número já existir
        create: {
          name: dto.name,
          whatsappNumber: dto.whatsappNumber,
          schoolId: schoolId,
          status: 'PRE_INSCRITO',
        },
      });

      // 2. Buscar dados do Curso para a Taxa de Inscrição e Vencimento
      const course = await tx.course.findUnique({
        where: { id: dto.courseId },
      });

      if (!course) throw new NotFoundException('Curso não encontrado');

      // 3. Criar a Matrícula vinculando as disciplinas escolhidas (EnrollmentSubject)
      const enrollment = await tx.enrollment.create({
        data: {
          studentId: student.id,
          courseId: dto.courseId,
          status: 'PENDENTE',
          subjects: {
            create: dto.subjectIds.map((id) => ({
              subjectId: id,
            })),
          },
        },
        include: {
          subjects: true,
        },
      });

      // 4. Gerar a fatura de INSCRICAO (O gatilho para o pagamento via M-Pesa/Secretaria)
      const payment = await tx.payment.create({
        data: {
          studentId: student.id,
          amount: course.registrationFee,
          type: 'INSCRICAO',
          dueDate: new Date(), // Vencimento imediato para pré-inscrição
          isPaid: false,
          // Geramos uma referência única para facilitar a conferência via WhatsApp
        },
      });

      return {
        student,
        enrollment,
        paymentId: payment.id,
        amountToPay: payment.amount,
      };
    });
  }

  // Lista todos que ainda não pagaram a inscrição (Funil de Vendas)
  async listPreEnrolled(schoolId: string) {
    return this.prisma.student.findMany({
      where: { schoolId, status: 'PRE_INSCRITO' },
      include: {
        enrollments: {
          include: {
            course: true,
            _count: { select: { subjects: true } },
          },
        },
        payments: {
          where: { type: 'INSCRICAO', isPaid: false },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  // Encontra um aluno específico com TODO o histórico (Financeiro e Académico)
  // No students.service.ts
  async findOne(id: string, schoolId: string) {
    const student = await this.prisma.student.findFirst({
      where: {
        id: id,
        schoolId: schoolId,
      },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                priceRules: true, // <--- SE ESTA LINHA FALTAR, O VALOR SERÁ 0
              },
            },
            subjects: {
              include: {
                subject: true,
              },
            },
          },
        },
        payments: {
          orderBy: {
            dueDate: 'desc',
          },
        },
      },
    });

    if (!student) throw new NotFoundException('Estudante não encontrado');
    return student;
  }

  // Atualiza dados básicos do aluno
  async update(id: string, schoolId: string, data: any) {
    // Primeiro verificamos se o aluno pertence à escola
    await this.findOne(id, schoolId);

    return this.prisma.student.update({
      where: { id },
      data: {
        name: data.name,
        whatsappNumber: data.whatsappNumber,
        status: data.status,
      },
    });
  }

  // Remove (ou desativa) o aluno
  async remove(id: string, schoolId: string) {
    await this.findOne(id, schoolId);

    // Em sistemas escolares, é melhor mudar o status para 'REMOVIDO'
    // do que apagar os dados (por causa do histórico financeiro)
    return this.prisma.student.update({
      where: { id },
      data: { status: 'INATIVO' },
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.student.findMany({
      where: { schoolId },
      include: {
        enrollments: {
          include: {
            course: true,
            subjects: { include: { subject: true } },
          },
        },
        payments: true, // Para sabermos se pagou a inscrição
      },
    });
  }
}
