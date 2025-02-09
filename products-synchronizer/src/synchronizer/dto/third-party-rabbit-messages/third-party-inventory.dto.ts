import { IsString, IsNumber, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class ThirdPartyInventoryDto {
  @IsString()
  @IsNotEmpty()
  public sku: string;

  @IsNumber()
  @IsOptional()
  public stock?: number;

  @IsBoolean()
  @IsOptional()
  public isNegativeStockAllowed?: boolean;
}
