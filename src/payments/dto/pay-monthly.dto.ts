import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class PayMonthlyDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  amount: number;

  @IsString()
  month: string; // Ex: "Março/2026"
}