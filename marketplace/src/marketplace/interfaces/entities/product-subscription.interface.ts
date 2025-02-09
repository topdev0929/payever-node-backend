import { BusinessInterface } from '@pe/business-kit';
import { ProductInterface } from './product.interface';

export interface ProductSubscriptionInterface {
  business?: BusinessInterface;
  businessId: string;
  marketplaceProduct: ProductInterface;
  productId: string;
}
