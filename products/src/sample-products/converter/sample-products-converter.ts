import { ProductDto } from '../../../src/products/dto';
import { SampleProductInterface } from '../interfaces/sample-product.interface';

export class SampleProductConverter {
  public static async toProductDto(sampleProduct: SampleProductInterface): Promise<ProductDto> {

    return {
      active: sampleProduct.active,
      barcode: sampleProduct.barcode,
      businessId: sampleProduct.businessId,
      businessUuid: sampleProduct.businessId,
      categories: [],
      currency: sampleProduct.currency,
      description: sampleProduct.description,
      example: sampleProduct.example,
      images: sampleProduct.images,
      price: sampleProduct.price,

      sale: {
        onSales: sampleProduct.onSales,
        salePrice: sampleProduct.salePrice,
      },

      shipping: sampleProduct.shipping,
      sku: sampleProduct.sku,
      title: sampleProduct.title,
      type: sampleProduct.type,
      variants: [],
      vatRate: sampleProduct.vatRate,
    };
  }
}
