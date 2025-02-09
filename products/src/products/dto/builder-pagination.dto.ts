import { IsNumber, IsOptional } from 'class-validator';

export class BuilderPaginationDto {
  @IsOptional()
  @IsNumber()
  public page: number;

  @IsOptional()
  public order: any;

  @IsOptional()
  @IsNumber()
  public limit: number;

  @IsOptional()
  @IsNumber()
  public offset: number;
}
