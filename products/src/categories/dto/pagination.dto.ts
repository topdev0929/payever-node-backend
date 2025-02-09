import { IsNumber } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  public page: number;
  @IsNumber()
  public pageCount: number;
  @IsNumber()
  public perPage: number;
  @IsNumber()
  public itemCount: number;
}
