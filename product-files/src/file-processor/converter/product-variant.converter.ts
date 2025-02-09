import { CsvProductDto } from '../dto';
import { ProductVariantsDto } from '../../file-imports/dto/products';
import { ProductConverter } from './product.converter';
import { plainToClass } from 'class-transformer';
import { CsvOptionsEnum } from '../enums';

export class ProductVariantConverter {
  public static fromCsvProduct(source: CsvProductDto): ProductVariantsDto {
    return plainToClass<ProductVariantsDto, { }>(
      ProductVariantsDto,
      {
        attributes: ProductConverter.getAttributes(source),
        barcode: source['Bar Code'] || undefined,
        description: source.Description || undefined,
        images: !!source.Images ? source.Images.split(';') : [],
        inventory: {
          reserved: Number(source['Inventory Reserved']) || undefined,
          stock: Number(source['Inventory Stock']) || undefined,
        },
        options: this.getOptions(source),
        price: Number(source.Price) || undefined,
        sale: {
          onSales: source['On Sale'] ? source['On Sale'].toLowerCase() === 'true' : false,
          saleEndDate: source['Sale End Date'],
          salePercent: Number(source['Sale Percent']),
          salePrice: Number(source['Sale Price']),
          saleStartDate: source['Sale Start Date'],
        },
        sku: source.SKU || undefined,
        title: source.Title || undefined,
      },
    );
  }

  private static getOptions(source: CsvProductDto): any {
    return [
      {
        name: source[CsvOptionsEnum.OptionName1] || undefined,
        value: source[CsvOptionsEnum.OptionValue1] || undefined,
      },
      {
        name: source[CsvOptionsEnum.OptionName2] || undefined,
        value: source[CsvOptionsEnum.OptionValue2] || undefined,
      },
      {
        name: source[CsvOptionsEnum.OptionName3] || undefined,
        value: source[CsvOptionsEnum.OptionValue3] || undefined,
      },
    ].filter((option: any) => option.name !== undefined && option.value !== undefined);
  }
}
