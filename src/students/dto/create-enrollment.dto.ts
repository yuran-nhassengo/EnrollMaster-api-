import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  whatsappNumber?: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;
}