import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async createPreEnrollment(dto: CreateEnrollmentDto, schoolId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Criar ou Encontrar o Estudante (pelo WhatsApp)
      const student = await tx.student.upsert({
        where: { whatsappNumber: dto.whatsappNumber || '' },
        update: {}, // Se já existe, não muda nada por enquanto
        create: {
          name: dto.name,
          whatsappNumber: dto.whatsappNumber,
          schoolId: schoolId,
          status: 'PRE_INSCRITO', // Status inicial
        },
      });

      // 2. Criar a Inscrição como PENDENTE
      const enrollment = await tx.enrollment.create({
        data: {
          studentId: student.id,
          courseId: dto.courseId,
          status: 'PENDENTE',
        },
      });

      // 3. Gerar a cobrança da taxa de inscrição na tabela de Pagamentos
      const course = await tx.course.findUnique({ where: { id: dto.courseId } });
      
      await tx.payment.create({
        data: {
          studentId: student.id,
          amount: course.price,
          type: 'INSCRICAO',
          isPaid: false,
        },
      });

      return { student, enrollment };
    });
  }

  async listPreEnrolled(schoolId: string) {
    return this.prisma.student.findMany({
      where: { schoolId, status: 'PRE_INSCRITO' },
      include: { enrollments: true },
    });
  }
}