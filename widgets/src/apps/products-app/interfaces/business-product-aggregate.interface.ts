import { BusinessInterface } from '../../../business/interfaces';
import { ProductInterface } from './product.interface';

export interface BusinessProductAggregateInterface extends ProductInterface {
  business?: BusinessInterface;
  businessId: string;
}
