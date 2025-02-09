import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class ProductInventoryDto {
  @IsString()
  @IsNotEmpty()
  public sku: string;

  @IsOptional()
  @IsNumber()
  public stock?: number;

  @IsOptional()
  @IsNotEmpty()
  public quantity?: number;
}
