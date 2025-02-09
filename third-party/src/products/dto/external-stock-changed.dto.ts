import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class ExternalStockChangedDto {
  @ApiProperty()
  @IsString()
  public sku: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  public quantity: number;

}
