import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto, schoolId: string) {
    // 1. Verificar se e-mail já existe
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Este e-mail já está em uso.');

    // 2. Hash da senha
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Criar usuário vinculado à escola do Admin logado
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        schoolId: schoolId, // Forçamos o ID da escola vindo do Token
      },
      select: { id: true, email: true, role: true, schoolId: true }, // Não retorna a senha
    });
  }

  async findAllBySchool(schoolId: string) {
    return this.prisma.user.findMany({
      where: { schoolId },
      select: { id: true, email: true, role: true },
    });
  }
}
