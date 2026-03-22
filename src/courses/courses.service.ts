import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseDto, schoolId: string) {
    return this.prisma.course.create({
      data: {
        name: dto.name,
        registrationFee: dto.registrationFee,
        durationMonths: dto.durationMonths,
        schoolId: schoolId,
        // Criando as regras de preço junto com o curso
        priceRules: {
          create: dto.priceRules,
        },
      },
      include: {
        priceRules: true, // Retorna as regras criadas para conferência
      },
    });
  }

  async findAllBySchool(schoolId: string) {
    console.log('[CoursesService] findAllBySchool:', schoolId);
    try {
      const result = await this.prisma.course.findMany({
        where: { schoolId },
        include: {
          priceRules: true,
          _count: {
            select: { enrollments: true },
          },
        },
      });
      console.log('[CoursesService] resultado:', result.length);
      return result;
    } catch (err) {
      console.error('[CoursesService] erro:', err);
      throw err;
    }
  }
}
