import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
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
  findAll(@Req() req) {
    return this.coursesService.findAllBySchool(req.user.schoolId);
  }
}
