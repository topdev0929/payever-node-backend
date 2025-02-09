import { IsNumber, IsOptional } from 'class-validator';
import { SortDto } from './sort.dto';

export class BuilderPaginationDto extends SortDto {
  @IsOptional()
  public page: any;

  @IsOptional()
  public order: any;

  @IsOptional()
  public limit: any;

  @IsOptional()
  public offset: any;
}
