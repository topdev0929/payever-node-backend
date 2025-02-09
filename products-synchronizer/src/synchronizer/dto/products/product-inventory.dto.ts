import { IsString, IsNumber, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class ProductInventoryDto {
  @IsString()
  @IsNotEmpty()
  public sku: string;

  @IsNumber()
  @IsNotEmpty()
  public stock: number;

  @IsBoolean()
  @IsOptional()
  public isNegativeStockAllowed?: boolean;
}
