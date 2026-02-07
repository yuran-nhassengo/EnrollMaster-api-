import {
  IsString,
  IsNumber,
  Min,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Primeiro, definimos a estrutura de cada regra de preço
class PriceRuleDto {
  @IsInt()
  @Min(1)
  subjectCount: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateCourseDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  registrationFee: number;

  @IsInt()
  @Min(1)
  durationMonths: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceRuleDto) // Necessário para o class-transformer entender o array de objetos
  priceRules: PriceRuleDto[];
}
