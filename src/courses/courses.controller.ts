import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
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
  // @Roles('ADMIN') // Apenas Admins da escola criam cursos
  create(@Body() dto: CreateCourseDto, @Req() req) {
    // Pegamos o schoolId que injetamos no token JWT lá no Auth
    const schoolId = req.user.schoolId;
    return this.coursesService.create(dto, schoolId);
  }

  @Get()
//  @Roles('ADMIN', 'STAFF') // Staff também pode ver os cursos
  findAll(@Req() req) {
    return this.coursesService.findAllBySchool(req.user.schoolId);
  }
}
