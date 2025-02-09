import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsPositive, IsString, IsNotEmpty } from 'class-validator';
import { InventoryQuantityChangeInterface } from '../../interfaces/cart-change-set';
import { InventoryLocationInterface } from '../../interfaces';

export class InventoryLocationQuantityChangeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public locationId: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  public stock: number;
}
