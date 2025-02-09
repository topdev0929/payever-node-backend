import { IsNumber, IsOptional } from 'class-validator';

export class ProductInventoryDto {
  @IsOptional()
  @IsNumber()
  public stock?: number;

  @IsOptional()
  @IsNumber()
  public reserved?: number;
}
