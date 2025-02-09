import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { OriginalInventoryDto } from './original-inventory.dto';

export class CreateInventoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public sku: string;

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

  @ApiProperty()
  @IsString()
  @IsOptional()
  public origin?: string = 'commerceos';

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => OriginalInventoryDto)
  public originalInventory?: OriginalInventoryDto;
}
