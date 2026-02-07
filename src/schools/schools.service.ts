import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSchoolDto) {
    // 1. Gerar e-mail automático: "admin.nomedaescola@sistema.com"
    // Remove espaços e coloca em minúsculo
    const slug = dto.name.toLowerCase().replace(/\s+/g, '');
    const adminEmail = `admin.${slug}@sistema.com`;

    // 2. Verificar se esse e-mail já existe (caso duas escolas tenham nomes idênticos)
    const existingUser = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });
    if (existingUser) {
      throw new BadRequestException(
        'Já existe uma escola com este nome (e-mail admin duplicado).',
      );
    }

    // 3. Hash da senha padrão
    const hashedPassword = await bcrypt.hash('123456', 10);

    // 4. Transação Atômica: Cria escola e usuário juntos
    return this.prisma.$transaction(async (tx) => {
      const school = await tx.school.create({
        data: {
          name: dto.name,
          location: dto.location,
          contact: dto.contact,
        },
      });

      await tx.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: `Admin ${dto.name}`,
          role: 'ADMIN',
          schoolId: school.id,
        },
      });

      return {
        message: 'Escola e Admin criados com sucesso',
        credentials: {
          email: adminEmail,
          password: '123456', // Retornamos para o Super Admin informar à escola
        },
        school,
      };
    });
  }

  async findAll() {
    return this.prisma.school.findMany({
      include: { _count: { select: { students: true } } },
    });
  }
}
