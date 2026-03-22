import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  Headers,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Rota pública para o bot WhatsApp — autenticada por API key
  @Get('public')
  findPublic(
    @Headers('x-api-key') apiKey: string,
    @Query('schoolId') schoolId: string,
  ) {
    const expectedKey = process.env.WHATSAPP_API_KEY ?? '';
    if (!expectedKey || apiKey !== expectedKey) {
      throw new UnauthorizedException('Chave de API inválida');
    }
    if (!schoolId) {
      throw new BadRequestException('schoolId é obrigatório');
    }
    return this.coursesService.findAllBySchool(schoolId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCourseDto, @Req() req) {
    const schoolId = req.user.schoolId;

    if (!schoolId) {
      throw new BadRequestException(
        'Apenas usuários vinculados a uma escola podem criar cursos.',
      );
    }

    return this.coursesService.create(dto, schoolId);
  }

  @Get()
  //  @Roles('ADMIN', 'STAFF') // Staff também pode ver os cursos
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.coursesService.findAllBySchool(req.user.schoolId);
  }
}
