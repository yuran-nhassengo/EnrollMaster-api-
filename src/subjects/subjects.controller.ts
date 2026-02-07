import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSubjectsDto } from './dto/create-subject.dto';

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectsController {
  constructor(private readonly service: SubjectsService) {}

  /**
   * Criar uma ou várias disciplinas
   */
  @Post()
  create(@Body() dto: CreateSubjectsDto) {
    return this.service.create(dto.names);
  }

  /**
   * Listar todas as disciplinas
   */
  @Get()
  findAll() {
    return this.service.findAll();
  }

  /**
   * Deletar disciplina pelo ID
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
