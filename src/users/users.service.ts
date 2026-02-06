import {
  Injectable,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto, loggedUser: any) {
    const { email, name, contacto, role, schoolId } = dto;

    // Verifica se email já existe
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('Este e-mail já está em uso.');

    // Apenas super_admin pode criar outro super_admin
    if (
      role === UserRole.SUPER_ADMIN &&
      loggedUser.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Apenas super_admin pode criar outro super_admin.',
      );
    }

    // Determinar escola do usuário a ser criado
    let finalSchoolId: string | null = null;

    if (role === UserRole.SUPER_ADMIN) {
      // super_admin não precisa de escola
      finalSchoolId = null;
    } else if (loggedUser.role === UserRole.SUPER_ADMIN) {
      // super_admin criando admin ou staff: escola vem do DTO
      if (!schoolId) {
        throw new BadRequestException(
          'É necessário escolher uma escola para este usuário.',
        );
      }
      finalSchoolId = schoolId;
    } else {
      // admin normal: escola obrigatória é do token
      finalSchoolId = loggedUser.schoolId;
    }

    // Hash da senha padrão
    const hashedPassword = await bcrypt.hash('123456', 10);

    return this.prisma.user.create({
      data: {
        email,
        name,
        contacto,
        password: hashedPassword,
        role,
        schoolId: finalSchoolId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        contacto: true,
        role: true,
        schoolId: true,
      },
    });
  }

  async findAllBySchool(schoolId: string) {
    return this.prisma.user.findMany({
      where: { schoolId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        school: true,
        contacto: true,
      },
    });
  }

  async findAll(loggedUser: { role: string; schoolId: string | null }) {
    if (loggedUser.role === 'SUPER_ADMIN') {
      return this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          contacto: true,
          school: { select: { name: true } },
        },
      });
    }

    if (loggedUser.role === 'ADMIN') {
      return this.prisma.user.findMany({
        where: { schoolId: loggedUser.schoolId },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          contacto: true,
          school: { select: { name: true } },
        },
      });
    }

    if (loggedUser.role === 'STAFF') {
      return this.prisma.user.findMany({
        where: { schoolId: loggedUser.schoolId, role: 'STAFF' },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          contacto: true,
          school: { select: { name: true } },
        },
      });
    }

    return [];
  }
}
