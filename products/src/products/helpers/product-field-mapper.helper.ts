import { ProductFilterFieldsMapping } from '../enums';

export class ProductFieldMapperHelper {
  public static getFieldName(field: string): string {
    return ProductFilterFieldsMapping[field] ? ProductFilterFieldsMapping[field] : null;
  }

  public static isFieldAllowed(field: string): boolean {
    return this.getFieldName(field) !== null;
  }
}
