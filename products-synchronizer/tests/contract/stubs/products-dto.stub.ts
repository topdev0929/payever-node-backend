import { ProductDto } from '../../../src/synchronizer/dto/products';

export class ProductsDtoStub {
  public static getMinmalProductData(): ProductDto {
    return {
      active: false,
      categories: ['categoryName'],
      description: 'Test description',
      images: ['http://image.png'],
      onSales: true,
      price: 10,
      sku: 'test_sku',
      title: 'Test title',
      type: 'physical',
    }
  }

  public static getFullProductData(): ProductDto {
    return {
      active: false,
      barcode: 'test barcode',
      categories: ['categoryName'],
      country: 'DE',
      currency: 'EUR',
      description: 'Test description',
      images: ['http://image.png'],
      onSales: true,
      price: 10,
      salePrice: 15,
      shipping: {
        free: true,
        general: false,
        height: 13,
        length: 12,
        weight: 10,
        width: 11,
      },
      sku: 'test_sku',
      title: 'Test title',
      type: 'physical',
      variants: [{
        barcode: 'barcode',
        description: 'Description',
        images: ['image.jpg'],
        onSales: true,
        options: [{
          name: 'optionName',
          value: 'optionValue',
        }],
        price: 10,
        salePrice: 12,
        sku: 'test_sku',
        title: 'Title',
      }],
      vatRate: 12,
    }
  }
}
