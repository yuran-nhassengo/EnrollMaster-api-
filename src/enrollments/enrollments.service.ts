import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async createRegistration(data: {
    studentId: string;
    courseId: string;
    subjectIds: string[]; // IDs das disciplinas escolhidas
  }) {
    // 1. Buscar o curso para saber a taxa de inscrição
    const course = await this.prisma.course.findUnique({
      where: { id: data.courseId },
      include: { priceRules: true },
    });

    if (!course) throw new BadRequestException('Curso não encontrado');

    // 2. Criar a Inscrição e vincular disciplinas em uma transação
    return this.prisma.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.create({
        data: {
          studentId: data.studentId,
          courseId: data.courseId,
          status: 'PENDENTE',
          subjects: {
            create: data.subjectIds.map((id) => ({ subjectId: id })),
          },
        },
      });

      // 3. Gerar o pagamento da taxa de inscrição
      await tx.payment.create({
        data: {
          studentId: data.studentId,
          amount: course.registrationFee,
          type: 'INSCRICAO',
          dueDate: new Date(), // Vence hoje
          isPaid: false,
        },
      });

      return enrollment;
    });
  }

  async findAll() {
    return this.prisma.enrollment.findMany({
      include: {
        student: true,
        course: true,
        subjects: { include: { subject: true } },
      },
    });
  }
}
