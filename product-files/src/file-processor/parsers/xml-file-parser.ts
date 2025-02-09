import { parseString } from 'xml2js';
import { Injectable } from '@nestjs/common';
import * as camelcaseKeys from 'camelcase-keys';
import { parseBooleans } from 'xml2js/lib/processors';
import { ProductDto, ProductInventoryDto, ProductVariantsDto } from '../../file-imports/dto/products';
import { environment } from '../../environments';
import * as libxsd from 'libxmljs2-xsd';
import { join } from 'path';
import { ParserInterface } from './parser.interface';
import { ImportContentDto } from '../../file-imports/dto';
import { FileProcessorException, ProcessorErrorKind } from '../exceptions';

const convertVariant: any = (p: any): ProductVariantsDto => {
  const r: any = new ProductVariantsDto();

  r.sku = p.sku ? p.sku[0] : undefined;

  r.title = p.title ? p.title[0] : undefined;
  r.description = p.description ? p.description[0] : undefined;

  r.price = p.price ? Number(p.price[0]) : undefined;

  r.sale = p.sale ? {
    onSales: p.sale[0].onSales ? p.sale[0].onSales[0] : undefined,
    saleEndDate: p.sale[0].saleEndDate ? p.sale[0].saleEndDate[0] : undefined,
    salePercent: p.sale[0].salePercent ? Number(p.sale[0].salePercent[0]) : undefined,
    salePrice: p.sale[0].salePrice ? Number(p.sale[0].salePrice[0]) : undefined,
    saleStartDate: p.sale[0].saleStartDate ? p.sale[0].saleStartDate[0] : undefined,
  } : undefined;
  r.barcode = p.barCode ? p.barCode[0] : undefined;

  r.images = p.images ? p.images[0].image.map((i: any) => i.url[0]) : [];
  r.imagesUrl = p.images ? p.images[0].image.map((i: any) => i.url[0]) : [];
  r.attributes = p.attributes
    ? p.attributes[0].attribute.map(
      (attribute: any) => ({ name: attribute.name[0], value: attribute.value[0], type: attribute.type[0] }),
    )
    : [];

  r.options = p.options
    ? p.options[0].option.map(
      (option: any) => ({ name: option.name[0], value: option.value[0], type: option.type[0] }),
    )
    : [];

  if (p.inventory) {
    Object.assign(r, convertInventory(p.inventory));
  }

  return r;
};

const convertCategory: any = (node: any) => node.title[0];
const convertChannelSet: any = (node: any) => node.id[0];

const convertProduct: any = (p: any): ProductDto => {
  const r: any = new ProductDto();

  r.sku = p.sku ? p.sku[0] : undefined;
  r.currency = p.currency ? p.currency[0] : undefined;

  r.type = p.title ? p.type[0] : undefined;

  r.title = p.title ? p.title[0] : undefined;
  r.description = p.description ? p.description[0] : undefined;

  r.active = p.enabled ? p.enabled[0] : undefined;
  r.price = p.price ? Number(p.price[0]) : undefined;
  r.sale = p.sale ? {
    onSales: p.sale[0].onSales ? p.sale[0].onSales[0] : undefined,
    saleEndDate: p.sale[0].saleEndDate ? p.sale[0].saleEndDate[0] : undefined,
    salePercent: p.sale[0].salePercent ? Number(p.sale[0].salePercent[0]) : undefined,
    salePrice: p.sale[0].salePrice ? Number(p.sale[0].salePrice[0]) : undefined,
    saleStartDate: p.sale[0].saleStartDate ? p.sale[0].saleStartDate[0] : undefined,
  } : undefined;

  r.barcode = p.barCode ? p.barCode[0] : undefined;

  r.images = p.images ? p.images[0].image.map((i: any) => i.url[0]) : [];
  r.imagesUrl = p.images ? p.images[0].image.map((i: any) => i.url[0]) : [];

  r.channelSets = p.channelSets
    ? p.channelSets[0].channelSet.map(convertChannelSet)
    : [];
  r.categories = p.productCategories
    ? p.productCategories[0].productCategory.map(convertCategory)
    : [];
  r.variants = p.variants ? p.variants[0].variant.map(convertVariant) : [];

  if (p.shipping) {
    r.shipping = {
      height: p.shipping[0].height ? Number(p.shipping[0].height[0]) : null,
      length: p.shipping[0].length ? Number(p.shipping[0].length[0]) : null,
      weight: p.shipping[0].weight ? Number(p.shipping[0].weight[0]) : null,
      width: p.shipping[0].width ? Number(p.shipping[0].width[0]) : null,
    };
  }

  r.attributes = p.attributes
    ? p.attributes[0].attribute.map(
      (attribute: any) => ({ name: attribute.name[0], value: attribute.value[0], type: attribute.type[0] }),
    )
    : [];

  r.variantAttributes = p.variantAttributes
    ? p.variantAttributes[0].variantAttribute.map(
      (attribute: any) => ({ name: attribute.name[0], type: attribute.type[0] }),
    )
    : [];

  if (p.inventory) {
    Object.assign(r, convertInventory(p.inventory));
  }

  return r;
};

function convertInventory(inventory: any[]): any {
  let result: { inventory: ProductInventoryDto };
  if (inventory && inventory.length) {
    result = { inventory: { } };

    const stock: any = inventory[0].stock;
    if (stock && stock.length) {
      result.inventory.stock = Number(stock[0]);
    }

    const reserved: any = inventory[0].reserved;
    if (reserved && reserved.length) {
      result.inventory.reserved = Number(reserved[0]);
    }
  }

  return result;
}

@Injectable()
export class XmlFileParser implements ParserInterface {
  private xsdPath: string;

  constructor() {
    this.xsdPath = environment.xsdPath;
  }

  public async parse(data: string): Promise<ImportContentDto> {
    const xsdValidationErrors: any = await this.validateAgainstXsd(data, 'products.xsd');
    if (xsdValidationErrors.length > 0) {
      const errors: string[] = xsdValidationErrors.map((error: any) => error.message);
      throw new FileProcessorException(
        ProcessorErrorKind.ValidationFailed,
        JSON.stringify(errors),
        errors,
      );
    }

    return new Promise((resolve: any, reject: any) => {
      parseString(
        data,
        { mergeAttrs: true, valueProcessors: [parseBooleans] },
        (err: any, res: any) => {
          if (err) {
            reject(
              new FileProcessorException(
                ProcessorErrorKind.ParsingFailed,
                err.message,
                err,
              ),
            );
          }

          const resConverted: any = camelcaseKeys(res, { deep: true });
          const pr: any = resConverted.import.products
            ? resConverted.import.products[0].product
            : [];
          const products: any = pr.map((p: any) => convertProduct(p));

          resolve(new ImportContentDto(products));
        },
      );
    });
  }

  public getContentType(): string {
    return 'xml';
  }

  private async validateAgainstXsd(xml: string, schemaName: string): Promise<any[]> {
    const schema: any = libxsd.parseFile(join(this.xsdPath, schemaName));
    const validationErrors: any = schema.validate(xml);

    return validationErrors ? validationErrors : [];
  }
}
