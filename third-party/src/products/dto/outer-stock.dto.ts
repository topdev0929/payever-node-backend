import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class OuterStockDto {
  @ApiProperty()
  @IsString()
  public sku: string;

  @ApiProperty()
  @IsNumber()
  public stock: number;
}
