import { ProductVariantInterface } from './product-variant.interface';

export class ImportProductInterface {
  public businessUuid: string;
  public images: string[];
  public title: string;
  public description: string;
  public hidden: boolean;
  public price: number;
  public salePrice?: number;
  public sku: string;
  public barcode?: string;
  public categories: string[];
  public uuid?: string;
  public enabled: boolean;
  public variants?: ProductVariantInterface[];
}
