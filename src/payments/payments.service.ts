import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PayMonthlyDto } from './dto/pay-monthly.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // 1. Confirmar Pagamento de Inscrição (Ativa o Aluno)
  async confirmEnrollmentPayment(paymentId: string, schoolId: string) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { student: true },
      });

      if (!payment || payment.student.schoolId !== schoolId) {
        throw new NotFoundException(
          'Pagamento não encontrado ou não pertence a esta escola',
        );
      }

      if (payment.isPaid) {
        throw new BadRequestException('Este pagamento já foi realizado');
      }

      // Marcar pagamento como pago
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          totalPaid: payment.amount, // Na inscrição, geralmente não há multa
        },
      });

      // Mudar status do estudante para ATIVO
      await tx.student.update({
        where: { id: payment.studentId },
        data: { status: 'ATIVO' },
      });

      // Atualizar as inscrições pendentes para ATIVO
      await tx.enrollment.updateMany({
        where: { studentId: payment.studentId, status: 'PENDENTE' },
        data: { status: 'ATIVO' },
      });

      return { message: 'Pagamento confirmado e aluno ativado!' };
    });
  }

  // 2. Registrar Mensalidade Manual (Com cálculo de Multa)
  async registerMonthlyPayment(dto: PayMonthlyDto, schoolId: string) {
    // Verificar se o aluno pertence à escola do usuário logado
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });

    if (!student || student.schoolId !== schoolId) {
      throw new NotFoundException('Estudante não encontrado nesta escola');
    }

    // Lógica de Multa Opcional:
    // Se você estiver recebendo o 'penalty' do front, usamos ele.
    // Se não, o totalPaid é apenas o amount.
    const penaltyValue = dto.penalty || 0;
    const totalToPay = dto.amount + penaltyValue;

    return this.prisma.payment.create({
      data: {
        studentId: dto.studentId,
        amount: dto.amount,
        penalty: penaltyValue,
        totalPaid: totalToPay,
        month: dto.month,
        year: dto.year,
        type: 'MENSALIDADE',
        dueDate: new Date(), // Em pagamentos manuais diretos, o vencimento costuma ser hoje
        isPaid: true,
        paidAt: new Date(),
      },
    });
  }

  // 3. Buscar Histórico de Pagamentos de um Aluno
  async getStudentPayments(studentId: string, schoolId: string) {
    return this.prisma.payment.findMany({
      where: {
        studentId,
        student: { schoolId },
      },
      orderBy: { dueDate: 'desc' },
    });
  }
}
