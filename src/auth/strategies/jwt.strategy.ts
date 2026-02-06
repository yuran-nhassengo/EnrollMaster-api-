import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MINHA_CHAVE_SUPER_SECRETA', // Em produção, use variáveis de ambiente
    });
  }

  async validate(payload: any) {
    // O que retornarmos aqui ficará disponível em req.user
    return {
      userId: payload.sub,
       name: payload.name, 
      email: payload.email,
      role: payload.role,
      schoolId: payload.schoolId,
    };
  }
}
