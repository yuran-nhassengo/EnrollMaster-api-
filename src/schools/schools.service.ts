import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSchoolDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.adminPassword, salt);

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Cria a Escola
        const school = await tx.school.create({
          data: { name: dto.name },
        });

        // 2. Cria o Admin da Escola vinculado a ela
        const admin = await tx.user.create({
          data: {
            email: dto.adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
            schoolId: school.id,
          },
        });

        return { school, adminEmail: admin.email };
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
