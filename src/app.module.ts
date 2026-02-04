import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchoolsModule } from './schools/schools.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    SchoolsModule,
    AuthModule,
    CoursesModule,
    StudentsModule,
    PaymentsModule,
    UsersModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
