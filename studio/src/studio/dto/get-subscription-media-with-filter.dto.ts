import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterDto } from './filter.dto';
import { SortDto } from './sort.dto';

export class GetSubscriptionMediaWithFilterDto extends SortDto {
  @IsNumber()
  public limit: number;

  @IsNumber()
  public offset: number;

  @ValidateNested({ each: true})
  @Type(() => FilterDto)
  @IsOptional()
    public filters?: FilterDto[];
}
