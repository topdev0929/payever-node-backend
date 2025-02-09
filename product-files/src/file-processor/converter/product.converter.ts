import { CsvProductDto } from '../dto';
import { ProductAttributeDto, ProductDto, ProductTypeEnum } from '../../file-imports/dto/products';
import { plainToClass } from 'class-transformer';

export class ProductConverter {
  public static fromCsvProduct(source: CsvProductDto): ProductDto {
    return plainToClass<ProductDto, { }>(ProductDto, {
      active: source.Enabled ? source.Enabled.toLowerCase() === 'true' : true, // enable default true
      attributes: ProductConverter.getAttributes(source),
      barcode: source['Bar Code'],
      categories: [],
      currency: source.Currency,
      description: source.Description,
      images: !!source.Images ? source.Images.split(';') : [],     
      inventory: {
        reserved: Number(source['Inventory Reserved']),
        stock: Number(source['Inventory Stock']),
      },
      price: Number(source.Price),
      sale: {
        onSales: source['On Sale'] ? source['On Sale'].toLowerCase() === 'true' : false,
        saleEndDate: source['Sale End Date'],
        salePercent: Number(source['Sale Percent']),
        salePrice: Number(source['Sale Price']),
        saleStartDate: source['Sale Start Date'],
      },
      shipping: {
        height: Number(source['Height(Cm)']),
        length: Number(source['Length(Cm)']),
        weight: Number(source['Weight(Kg)']),
        width: Number(source['Width(Cm)']),
      },
      sku: source.SKU || source.Handle,
      title: source.Title,
      type: ProductConverter.getProductType(source.Type),
      variants: [],
    });
  }

  private static getProductType(type: string): ProductTypeEnum {
    switch (type.toLowerCase()) {
      case 'physical':
        return ProductTypeEnum.physical;
      case 'service':
        return ProductTypeEnum.service;
      case 'digital':
        return ProductTypeEnum.digital;
    }
  }

  public static getAttributes(source: CsvProductDto): ProductAttributeDto[] {
    const attributes: ProductAttributeDto[] = [];
    let i: number = 1;
    while (source[`Attribute${i} Name`]) {
      attributes.push({
        name: source[`Attribute${i} Name`],
        type: source[`Attribute${i} Type`] || null,
        value: source[`Attribute${i} Value`] || null,
      });

      i++;
    }

    return attributes;
  }
}
