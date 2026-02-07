import { IsArray, ArrayMinSize, IsString } from 'class-validator';

export class CreateSubjectsDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Informe pelo menos uma disciplina' })
  @IsString({ each: true })
  names: string[];
}
