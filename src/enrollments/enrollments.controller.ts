import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Post('full-registration')
  async fullRegistration(@Body() dto: any, @Req() req) {
    // CORREÇÃO: Usar "this.service" em vez de "this.enrollmentsService"
    return this.service.createFullRegistration(dto, req.user.schoolId);
  }

  @Post('register')
  create(@Body() body: any) {
    // A conversão '!!' deve ser feita aqui, na passagem para o service
    return this.service.createRegistration({
      studentId: body.studentId,
      courseId: body.courseId,
      subjectIds: body.subjectIds,
      paymentConfirmed: Boolean(body.payNow), // Use Boolean() ou !!body.payNow aqui
      amountPaid: body.amount,
      paymentMethod: body.paymentMethod,
    });
  }

  @Patch(':id/confirm-payment')
  confirm(@Param('id') id: string) {
    return this.service.confirmPayment(id);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch('update-full/:studentId')
  @UseGuards(JwtAuthGuard)
  async update(@Param('studentId') studentId: string, @Body() dto: any) {
    return this.service.updateFullRegistration(studentId, dto);
  }
}
