import { IsDefined, IsNumber, IsOptional } from 'class-validator';

export class GetPaginatedListQueryDto {
  @IsNumber()
  @IsDefined()
  public page: number;

  @IsNumber()
  public perPage: number;

  @IsOptional()
  @IsNumber()
  public skip?: number;
}
