import { Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested, IsDefined } from 'class-validator';
import { BusinessDto } from '../business.dto';
import { OrderDto } from './order.dto';

export class InventoryEventOrderCreatedDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessDto)
  public business: BusinessDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => OrderDto)
  public order: OrderDto;
}
