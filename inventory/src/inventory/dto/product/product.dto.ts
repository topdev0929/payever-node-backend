import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public sku: string;

  @ApiProperty()
  @IsString()
  public barcode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessUuid: string;
}
