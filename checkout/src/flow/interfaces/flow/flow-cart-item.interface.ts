import { ApiCallCartItemAttributesInterface } from '../../../common/interfaces';
import { CartItemTypeEnum } from '../../../common/enum';

export interface FlowCartItemInterface {
  /** @deprecated use `productId` instead */
  id?: string;

  extraData?: { };
  identifier?: string;
  image?: string;
  name?: string;
  originalPrice?: number;
  price: number;
  priceNet?: number;
  productId?: string;
  quantity: number;
  sku?: string;
  vat?: number;

  brand?: string;
  totalAmount?: number;
  totalTaxAmount?: number;
  totalDiscountAmount?: number;
  imageUrl?: string;
  productUrl?: string;
  category?: string;
  attributes?: ApiCallCartItemAttributesInterface;
  type?: CartItemTypeEnum;
}
