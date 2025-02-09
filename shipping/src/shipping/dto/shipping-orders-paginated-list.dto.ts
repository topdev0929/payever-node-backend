import { IsNumber, IsDefined } from 'class-validator';
import { ShippingOrderModel } from '../models';

export class ShippingOrdersPaginatedListDto {
  @IsNumber()
  public total: number;
  @IsNumber()
  public perPage: number;
  @IsNumber()
  public page: number;
  @IsDefined()
  public list: ShippingOrderModel[];
}
