import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async createRegistration(data: {
    studentId: string;
    courseId: string;
    subjectIds: string[];
    paymentConfirmed: boolean; // Novo campo
    amountPaid?: number; // Novo campo
    paymentMethod?: string; // Novo campo
  }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Criar a Inscrição
      const enrollment = await tx.enrollment.create({
        data: {
          studentId: data.studentId,
          courseId: data.courseId,
          status: data.paymentConfirmed ? 'PAGO' : 'PENDENTE',
          subjects: {
            create: data.subjectIds.map((id) => ({ subjectId: id })),
          },
        },
      });

      // 2. Se pagou agora, ativar o aluno
      if (data.paymentConfirmed) {
        await tx.student.update({
          where: { id: data.studentId },
          data: { status: 'ATIVO' },
        });
      }

      // 3. Criar o registro de pagamento
      await tx.payment.create({
        data: {
          studentId: data.studentId,
          amount: data.amountPaid || 0,
          type: 'INSCRICAO',
          dueDate: new Date(),
          isPaid: data.paymentConfirmed,
          paidAt: data.paymentConfirmed ? new Date() : null,
          // method: data.paymentMethod (adicione este campo no seu schema se quiser guardar)
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

  async confirmPayment(enrollmentId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Buscar a inscrição e o pagamento associado
      const enrollment = await tx.enrollment.findUnique({
        where: { id: enrollmentId },
        include: { student: true },
      });

      if (!enrollment) throw new Error('Inscrição não encontrada');

      // 2. Atualizar o Status da Matrícula
      await tx.enrollment.update({
        where: { id: enrollmentId },
        data: { status: 'PAGO' },
      });

      // 3. Atualizar o Aluno para ATIVO
      await tx.student.update({
        where: { id: enrollment.studentId },
        data: { status: 'ATIVO' },
      });

      // 4. Marcar o pagamento da taxa de inscrição como pago
      await tx.payment.updateMany({
        where: {
          studentId: enrollment.studentId,
          type: 'INSCRICAO',
        },
        data: {
          isPaid: true,
          paidAt: new Date(),
        },
      });

      return { message: 'Inscrição confirmada e aluno ativado!' };
    });
  }

  async createFullRegistration(data: any, schoolId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. O UPSERT é a chave: Ele garante que o ID do Estudante seja recuperado
      // Quer ele tenha acabado de ser criado ou já existisse no sistema.
      const student = await tx.student.upsert({
        where: { whatsappNumber: data.whatsappNumber || '' },
        update: { name: data.name },
        create: {
          name: data.name,
          whatsappNumber: data.whatsappNumber,
          schoolId: schoolId,
          status: data.paymentConfirmed ? 'ATIVO' : 'PRE_INSCRITO',
        },
      });

      // 2. VERIFICAÇÃO DE SEGURANÇA: Evita que a segunda "batida" do botão crie outra matrícula
      const existingEnrollment = await tx.enrollment.findFirst({
        where: { studentId: student.id, courseId: data.courseId },
      });

      if (existingEnrollment) {
        // Se já existir, apenas retornamos o que já foi criado em vez de duplicar
        return {
          student,
          enrollment: existingEnrollment,
          message: 'Já processado',
        };
      }

      // 3. CRIAÇÃO DA MATRÍCULA: Agora sim, usamos o ID que veio do Upsert
      const enrollment = await tx.enrollment.create({
        data: {
          studentId: student.id,
          courseId: data.courseId,
          status: data.paymentConfirmed ? 'PAGO' : 'PENDENTE',
          subjects: {
            create: data.subjectIds.map((id: string) => ({ subjectId: id })),
          },
        },
      });

      // 4. PAGAMENTO: Vinculado ao mesmo estudante
      await tx.payment.create({
        data: {
          studentId: student.id,
          amount: data.amountPaid || 0,
          type: 'INSCRICAO',
          dueDate: new Date(),
          isPaid: data.paymentConfirmed,
          paidAt: data.paymentConfirmed ? new Date() : null,
        },
      });

      return { student, enrollment };
    });
  }

  async updateFullRegistration(studentId: string, data: any) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Atualiza os dados básicos do Estudante
      const student = await tx.student.update({
        where: { id: studentId },
        data: {
          name: data.name,
          whatsappNumber: data.whatsappNumber,
        },
      });

      // 2. Busca a matrícula existente para este aluno
      const enrollment = await tx.enrollment.findFirst({
        where: { studentId: studentId, courseId: data.courseId },
      });

      if (enrollment) {
        // 3. SE JÁ EXISTE: Vamos atualizar as disciplinas (Limpar as velhas e pôr as novas)
        // Isso evita criar a 2ª ou 3ª matrícula igual
        await tx.enrollmentSubject.deleteMany({
          where: { enrollmentId: enrollment.id },
        });

        await tx.enrollment.update({
          where: { id: enrollment.id },
          data: {
            subjects: {
              create: data.subjectIds.map((id: string) => ({ subjectId: id })),
            },
          },
        });
      }

      return { student, enrollment };
    });
  }
}
