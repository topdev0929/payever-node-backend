import { ProductInterface } from '../interfaces/entities';

export interface ProductExportedDto extends ProductInterface {
  _id: string;
}
