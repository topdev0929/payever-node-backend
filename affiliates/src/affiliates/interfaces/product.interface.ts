import { BusinessInterface } from '@pe/business-kit';

export interface ProductInterface {
  business: BusinessInterface | string;
  price: number;
  title: string;
  image?: string;
}
