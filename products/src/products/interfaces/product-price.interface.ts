import { CommonFilterInterface } from '@pe/nest-kit';
import { AllFilterFieldCondition } from '../enums';
import { ProductSaleInterface } from './product-sale.interface';

export interface ProductPriceInterface {
  // tslint:disable-next-line: max-union-size
  condition: Pick<CommonFilterInterface, 'field' | 'fieldType' | 'value'> & {
    fieldCondition: AllFilterFieldCondition;
  };
  currency: string;
  price: number;
  sale?: ProductSaleInterface;
  vatRate?: number;
}
