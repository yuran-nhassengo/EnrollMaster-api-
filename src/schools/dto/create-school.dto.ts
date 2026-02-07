import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da escola é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A localização é obrigatória' })
  location: string;

  @IsString()
  @IsOptional()
  contact?: string; // Pode ser o telefone da escola
}