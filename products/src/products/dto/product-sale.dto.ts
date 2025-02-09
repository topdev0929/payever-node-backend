import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductSaleDto {
  @IsOptional()
  @IsBoolean()
  public onSales: boolean;

  @IsOptional()
  @IsNumber()
  public salePrice?: number;

  @IsNumber()
  @IsOptional()
  public salePercent?: number;

  @IsOptional()
  @IsString()
  public saleEndDate?: string;

  @IsOptional()
  @IsString()
  public saleStartDate?: string;
}
