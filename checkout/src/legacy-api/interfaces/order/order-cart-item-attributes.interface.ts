import { OrderCartItemAttributesDimensionsInterface } from './order-cart-item-attributes-dimensions.interface';

export interface OrderCartItemAttributesInterface {
  weight?: number;
  dimensions?: OrderCartItemAttributesDimensionsInterface;
}
