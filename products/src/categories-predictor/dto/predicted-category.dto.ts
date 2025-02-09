import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryAttributeDto } from '../../categories/dto';

export class PredictedCategoryDto {
  @IsString()
  @IsNotEmpty()
  public path: string;

  @IsOptional()
  @ValidateNested({ each: true})
  @Type(() => CategoryAttributeDto)
  public attributes?: CategoryAttributeDto[];
}
