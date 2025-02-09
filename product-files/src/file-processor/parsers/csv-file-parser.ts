import { Injectable } from '@nestjs/common';
import { ParserInterface } from './parser.interface';
import * as parse from 'csv-parse/lib/sync';
import { ProductDto } from '../../file-imports/dto/products';
import { CsvProductDto } from '../dto';
import { ProductConverter, ProductVariantConverter } from '../converter';
import { plainToClass } from 'class-transformer';
import { ImportContentDto } from '../../file-imports/dto';

@Injectable()
export class CsvFileParser implements ParserInterface {

  public async parse(data: string): Promise<ImportContentDto> {
    const products: Map<string, ProductDto> = new Map();

    const csvData: CsvProductDto[] = await this.parseCsvData(data);

    const variantParents: CsvProductDto[] = csvData.filter((product: CsvProductDto) => !product.SKU);
    variantParents.forEach((csvProduct: CsvProductDto) => {
      products.set(csvProduct.Handle, ProductConverter.fromCsvProduct(csvProduct));
    });

    for (const csvProduct of csvData) {
      if (csvProduct.SKU) {
        const parentProduct: ProductDto = products.get(csvProduct.Handle);

        const isVariant: boolean = !!parentProduct;
        if (isVariant) {
          parentProduct.variants.push(ProductVariantConverter.fromCsvProduct(csvProduct));
          products.set(csvProduct.Handle, parentProduct);
        } else {
          products.set(csvProduct.Handle, ProductConverter.fromCsvProduct(csvProduct));
        }
      }
    }

    return new ImportContentDto(Array.from(products.values()));
  }

  public getContentType(): string {
    return 'csv';
  }

  private async parseCsvData(data: string): Promise<CsvProductDto[]> {
    return parse(data, {
      columns: true,
      delimiter: ';',
      quote: '"',
      skip_empty_lines: true,
      trim: true,
    }).map((rawRecord: any) => plainToClass<CsvProductDto, any>(CsvProductDto, rawRecord));
  }
}
