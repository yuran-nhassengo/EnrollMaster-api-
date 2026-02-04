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
        price: dto.price,
        // No futuro, você pode expandir 'period' para uma tabela própria
        schoolId: schoolId, 
      },
    });
  }

  async findAllBySchool(schoolId: string) {
    return this.prisma.course.findMany({
      where: { schoolId },
    });
  }
}