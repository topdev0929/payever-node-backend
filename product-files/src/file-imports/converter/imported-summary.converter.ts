import { ImportedSummaryItemDto } from '../dto/imported-summary-item.dto';
import { ProductDto } from '../dto/products';
import { ImportedItemTypesEnum } from '../enums';

export class ImportedSummaryConverter {
  public static getImportedSummary(products: ProductDto[]): ImportedSummaryItemDto[] {
    const items: ImportedSummaryItemDto[] = [];

    for (const product of products) {
      items.push({
        sku: product.sku,
        type: ImportedItemTypesEnum.Product,
      });

      if (product.inventory) {
        items.push({
          sku: product.sku,
          type: ImportedItemTypesEnum.Inventory,
        });
      }

      if (product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          if (variant.inventory) {
            items.push({
              sku: variant.sku,
              type: ImportedItemTypesEnum.Inventory,
            });
          }
        }
      }
    }

    return items;
  }
}
