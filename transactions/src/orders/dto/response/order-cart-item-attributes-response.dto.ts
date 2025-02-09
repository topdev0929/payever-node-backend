import { Exclude, Expose, Type } from 'class-transformer';
import { OrderCartItemAttributesDimensionsResponseDto } from './order-cart-item-attributes-dimensions-response.dto';

@Exclude()
export class OrderCartItemAttributesResponseDto {
  @Expose()
  public weight?: number;

  @Type(() => OrderCartItemAttributesDimensionsResponseDto)
  @Expose()
  public dimensions?: OrderCartItemAttributesDimensionsResponseDto;
}
