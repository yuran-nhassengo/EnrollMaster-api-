import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PayMonthlyDto } from './dto/pay-monthly.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // 1. Confirmar Pagamento de Inscrição (Ativa o Aluno)
  async confirmEnrollmentPayment(paymentId: string, schoolId: string) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { student: true }
      });

      if (!payment || payment.student.schoolId !== schoolId) {
        throw new NotFoundException('Pagamento não encontrado');
      }

      // Marcar pagamento como pago
      await tx.payment.update({
        where: { id: paymentId },
        data: { isPaid: true, paidAt: new Date() }
      });

      // Mudar status do estudante para ATIVO
      await tx.student.update({
        where: { id: payment.studentId },
        data: { status: 'ATIVO' }
      });

      // Atualizar a inscrição para PAGO
      await tx.enrollment.updateMany({
        where: { studentId: payment.studentId },
        data: { status: 'PAGO' }
      });

      return { message: 'Estudante ativado com sucesso!' };
    });
  }

  // 2. Registrar Mensalidade Manual
  async registerMonthlyPayment(dto: PayMonthlyDto, schoolId: string) {
    return this.prisma.payment.create({
      data: {
        studentId: dto.studentId,
        amount: dto.amount,
        month: dto.month,
        type: 'MENSALIDADE',
        isPaid: true,
        paidAt: new Date(),
      }
    });
  }
}