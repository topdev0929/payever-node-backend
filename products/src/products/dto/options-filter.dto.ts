import { ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OptionDto } from './option.dto';
import { ProductCategoryDto } from './product-category.dto';

export class OptionsFilterDto {
  @ValidateNested({ each: true})
  @Type(() => OptionDto)
  @IsOptional()
  public options?: OptionDto[];

  @ValidateNested({ each: true})
  @Type(() => ProductCategoryDto)
  @IsOptional()
  public categories: ProductCategoryDto[];
}
