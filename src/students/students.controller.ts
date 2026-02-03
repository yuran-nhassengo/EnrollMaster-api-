import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // ROTA MANUAL (Protegida)
  @Post('manual-enroll')
  @UseGuards(JwtAuthGuard)
  createManual(@Body() dto: CreateEnrollmentDto, @Req() req) {
    return this.studentsService.createPreEnrollment(dto, req.user.schoolId);
  }

  // ROTA WHATSAPP (Exemplo de Webhook - Geralmente usa uma API Key em vez de JWT)
  @Post('whatsapp-enroll')
  createViaWhatsapp(@Body() dto: CreateEnrollmentDto & { schoolId: string }) {
    // Aqui o bot enviaria o schoolId da escola que o aluno escolheu
    return this.studentsService.createPreEnrollment(dto, dto.schoolId);
  }

  @Get('pre-enrolled')
  @UseGuards(JwtAuthGuard)
  getPreEnrolled(@Req() req) {
    return this.studentsService.listPreEnrolled(req.user.schoolId);
  }
}