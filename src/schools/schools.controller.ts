import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas as rotas deste controller
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @Roles('SUPER_ADMIN') // Apenas o dono da plataforma cria escolas
  create(@Body() dto: CreateSchoolDto) {
    return this.schoolsService.create(dto);
  }

  @Get()
  @Roles('SUPER_ADMIN')
  findAll() {
    return this.schoolsService.findAll();
  }
}