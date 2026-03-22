import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class WhatsappEnrollmentDto {
  @IsString()
  whatsappNumber: string;

  @IsString()
  name: string;

  @IsString()
  courseId: string;

  @IsString()
  schoolId: string;

  @IsArray()
  @IsOptional()
  subjectIds?: string[];

  @IsBoolean()
  @IsOptional()
  paymentConfirmed?: boolean;

  @IsOptional()
  amountPaid?: number;
}
