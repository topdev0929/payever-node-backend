import { ProductBaseInterface } from '../../new-products/interfaces/product-base.interface';
import { OptionInterface } from './option.interface';
import { ProductAttributeInterface } from '../../products/interfaces';

export interface VariantInterface extends ProductBaseInterface {
  product: string;

  barcode: string;
  description: string;
  images: string[];
  imagesUrl: string[];
  onSales: boolean;
  price: number;
  salePrice: number;
  attributes: ProductAttributeInterface[];

  /** @deprecated */
  options: OptionInterface[];

  /** @deprecated */
  hidden: boolean;
}
