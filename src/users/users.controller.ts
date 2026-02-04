import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  //@Roles('ADMIN') // Apenas o Admin da escola cria novos usuários
  create(@Body() dto: CreateUserDto, @Req() req) {
    // Pegamos o schoolId injetado pelo JwtStrategy
    const schoolId = req.user.schoolId;
    return this.usersService.create(dto, schoolId);
  }

  @Get()
  //@Roles('ADMIN')
  findAll(@Req() req) {
    return this.usersService.findAllBySchool(req.user.schoolId);
  }
}