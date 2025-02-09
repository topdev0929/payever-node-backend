import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class ExternalStockDto {
  @ApiProperty()
  @IsString()
  public sku: string;

  @ApiProperty()
  @IsString()
  public barcode: string;

  @ApiProperty()
  @IsBoolean()
  public isTrackable: boolean;

  @ApiProperty()
  @IsBoolean()
  public isNegativeStockAllowed: boolean;
}
