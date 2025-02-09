import { ApiCallCartItemAttributesInterface } from '../../common/interfaces';
import { CartItemTypeEnum } from '../../common/enum';

export interface ThirdPartyPaymentItemSubmitInterface {
  description?: string;
  extraData?: { };
  identifier: string;
  name: string;
  price: number;
  priceNet?: number;
  quantity: number;
  sku?: string;
  thumbnail?: string;
  url?: string;
  vatRate?: number;

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
