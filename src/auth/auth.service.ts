import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = { 
        email: user.email, 
        sub: user.id, 
        role: user.role, 
        schoolId: user.schoolId 
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          email: user.email,
          role: user.role,
          schoolId: user.schoolId
        }
      };
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }
}