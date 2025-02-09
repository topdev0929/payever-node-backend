import { ApiCallCartItemAttributesDimensionsInterface } from './api-call-cart-item-attributes-dimensions.interface';

export interface ApiCallCartItemAttributesInterface {
  weight?: number;
  dimensions?: ApiCallCartItemAttributesDimensionsInterface;
}
