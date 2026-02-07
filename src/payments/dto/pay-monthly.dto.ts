import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsInt,
  Max,
  IsOptional,
} from 'class-validator';

export class PayMonthlyDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID do aluno é obrigatório' })
  studentId: string;

  @IsNumber()
  @Min(0)
  amount: number; // Valor base da mensalidade

  @IsInt()
  @Min(1)
  @Max(12)
  month: number; // Agora usamos Int (1-12) conforme o seu Schema

  @IsInt()
  @Min(2024)
  year: number; // Adicionado para garantir o registro no ano correto

  @IsNumber()
  @IsOptional()
  @Min(0)
  penalty?: number; // Campo opcional caso queira aplicar multa manualmente
}
