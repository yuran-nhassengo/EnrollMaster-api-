import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

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

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'Selecione pelo menos uma disciplina' })
  subjectIds: string[]; // Array com os IDs das disciplinas (ex: ["id-matematica", "id-portugues"])
}
