import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export class PaginatedListInfoDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => PaginationDto)
  public pagination: PaginationDto;
}
