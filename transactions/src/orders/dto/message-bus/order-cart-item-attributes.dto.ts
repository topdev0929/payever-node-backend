import { IsNumber } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { OrderCartItemAttributesDimensionsDto } from './order-cart-item-attributes-dimensions.dto';

@Exclude()
export class OrderCartItemAttributesDto {
  @IsNumber()
  @Expose()
  public weight?: number;

  @Type(() => OrderCartItemAttributesDimensionsDto)
  @Expose()
  public dimensions?: OrderCartItemAttributesDimensionsDto;
}
