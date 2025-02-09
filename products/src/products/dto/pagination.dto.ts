import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  public limit: number;

  @IsNumber()
  public page: number;

  @IsNumber()
  @IsOptional()
  public offset?: number;
}
