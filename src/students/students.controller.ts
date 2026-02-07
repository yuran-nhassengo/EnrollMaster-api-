import {
  Controller,
  Post,
  Get,
  Patch, // Adicionado
  Delete,
  Body,
  Param, // Adicionado para ler o :id
  UseGuards,
  Req,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('manual-enroll')
  @UseGuards(JwtAuthGuard)
  createManual(@Body() dto: CreateEnrollmentDto, @Req() req) {
    return this.studentsService.createPreEnrollment(dto, req.user.schoolId);
  }

  @Post('whatsapp-enroll')
  createViaWhatsapp(@Body() dto: CreateEnrollmentDto & { schoolId: string }) {
    return this.studentsService.createPreEnrollment(dto, dto.schoolId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.studentsService.findAll(req.user.schoolId);
  }

  @Get('pre-enrolled')
  @UseGuards(JwtAuthGuard)
  getPreEnrolled(@Req() req) {
    return this.studentsService.listPreEnrolled(req.user.schoolId);
  }

  // RESOLVE O 404: Busca detalhes do estudante
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.studentsService.findOne(id, req.user.schoolId);
  }

  // EDITA: Atualiza dados do estudante
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateDto: any, @Req() req) {
    return this.studentsService.update(id, req.user.schoolId, updateDto);
  }

  // REMOVE: Desativa o estudante
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.studentsService.remove(id, req.user.schoolId);
  }
}
