import { ProductTypeEnum } from '../../src/products/enums';
import { ProductCategoryDto, ProductDto } from '../../src/products/dto';
import { ProductShippingInterface, ProductVariantInterface } from '../../src/products/interfaces';
import variants from '../product-variants.json';

export class ProductFixture {
  public createAt: Date = new Date();

  public businessUuid(): string {
    return '0d55f2b6-4a61-418b-a805-4e433e9d997b';
  }

  public fullProduct(): ProductDto {
    return {
      businessUuid: this.businessUuid(),
      uuid: '6e0c9646-13bc-46cc-bfb0-20a60e66ebed',

      active: true,
      barcode: '1234567890123',
      categories: [
        {
          _id: '',
          businessUuid: this.businessUuid(),
          slug: '',
          title: '',
        } as ProductCategoryDto,
      ],
      currency: 'EUR',
      description: 'Some description',
      images: ['http://localhost:4141/image1.jpg'],
      imagesUrl: ['http://localhost:4141/image2.jpg'],
      onSales: false,
      price: 42,
      salePrice: 32,
      shipping: {
        free: false,
        general: false,
        height: 14,
        length: 13,
        weight: 10,
        width: 12,
      } as ProductShippingInterface,
      sku: '12345678911abcd:efgh',
      title: 'A Title',
      type: ProductTypeEnum.physical,
      variants: variants,
    } as ProductDto;
  }

  public equivalentProductModel(): ProductDto {
    const productDto: ProductDto = this.fullProduct();

    return {
      _id: productDto._id,
      active: productDto.active,
      barcode: productDto.barcode,
      businessUuid: productDto.businessUuid,
      categories: productDto.categories,
      currency: productDto.currency,
      description: productDto.description,
      example: productDto.example,
      images: productDto.images,
      imagesUrl: productDto.imagesUrl,
      onSales: productDto.onSales,
      price: productDto.price,
      salePrice: productDto.salePrice,
      shipping: productDto.shipping,
      sku: productDto.sku,
      title: productDto.title,
      type: productDto.type,
      variants: productDto.variants,

      createdAt: this.createAt,
      updatedAt: this.createAt,
    } as ProductDto;
  }
}
