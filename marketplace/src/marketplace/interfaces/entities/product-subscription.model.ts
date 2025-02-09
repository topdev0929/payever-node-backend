import { Document } from 'mongoose';

import { BusinessModel } from './business.model';
import { ProductModel } from './product.model';
import { ProductSubscriptionInterface } from './product-subscription.interface';

export interface ProductSubscriptionModel extends ProductSubscriptionInterface, Document {
  business?: BusinessModel;
  marketplaceProduct: ProductModel;
}
