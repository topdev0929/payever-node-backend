import { ProductConnectionPlanInterface } from './plan.interface';

export interface ProductInterface {
  id: string;
  plans: ProductConnectionPlanInterface[];
}
