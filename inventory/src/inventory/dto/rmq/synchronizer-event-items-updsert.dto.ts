import { ImportProductInterface } from './import-product.interface';

export class ItemsImportPayload {
  public businessUuid: string;
  public items: ImportProductInterface[];
}
