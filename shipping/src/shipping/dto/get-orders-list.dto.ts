import { Type } from 'class-transformer';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { FilterDto } from './filter.dto';

export class GetOrdersListDto {
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  public filters: FilterDto[];

  @IsOptional()
  @IsNumber()
  public page: number;

  @IsOptional()
  @IsNumber()
  public perPage: number;
}
