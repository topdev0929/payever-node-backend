import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class InventoryStockTransferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public fromLocationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public toLocationId: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  public quantity: number;
}
