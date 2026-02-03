import { IsString, IsNumber, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  period: string; // Ex: "Manhã", "Noite", "2026.1"
}