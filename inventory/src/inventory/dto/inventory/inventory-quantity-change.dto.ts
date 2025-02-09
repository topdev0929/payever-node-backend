import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { InventoryQuantityChangeInterface } from '../../interfaces/cart-change-set';
import { InventoryLocationQuantityChangeDto } from './inventory-location-quantity-change.dto';


export class InventoryQuantityChangeDto implements InventoryQuantityChangeInterface {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  public quantity: number;

  @ApiProperty()
  @IsOptional()
  public inventoryLocations?: InventoryLocationQuantityChangeDto[];

  @ApiProperty()
  @IsDate()
  @IsOptional()
  public createdAt?: Date;
}
