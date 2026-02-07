import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Post('register')
  create(
    @Body() body: { studentId: string; courseId: string; subjectIds: string[] },
  ) {
    return this.service.createRegistration(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
