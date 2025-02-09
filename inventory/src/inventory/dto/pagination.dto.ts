import { IsNumber } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  public limit: number;
  @IsNumber()
  public page: number;
}
