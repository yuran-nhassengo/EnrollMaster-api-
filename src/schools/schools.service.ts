import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSchoolDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Cria a Escola
        const school = await tx.school.create({
          data: {
            name: dto.name,
            location: dto.location, // Adicionado
            contact: dto.contact, // Adicionado
          },
        });

        return { school };
      });
    } catch (e) {
      throw new BadRequestException(
        'Erro ao criar escola ou admin. Verifique se o e-mail já existe.',
      );
    }
  }

  async findAll() {
    return this.prisma.school.findMany({
      include: { _count: { select: { students: true } } },
    });
  }
}
