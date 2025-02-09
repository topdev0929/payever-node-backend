import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { FilterDto } from '../filter.dto';
import { SortDto } from '../sort.dto';

export class ProductFilterDto extends FilterDto {
  @IsOptional()
  @IsNumber()
  public limit: number = 10;

  @IsOptional()
  @IsNumber()
  public page: number = 1;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  public sortBy: SortDto[] = [];
}
