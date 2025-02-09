import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateInventoryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public sku?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public barcode?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public isTrackable?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public isNegativeStockAllowed?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public requireShipping?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public lowStock?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public emailLowStock?: boolean;
}
