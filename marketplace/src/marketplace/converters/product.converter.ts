import { ProductDto } from '../dto';
import { ProductModel } from '../interfaces/entities';

export class ProductConverter {
  public static toProductDto(product: ProductModel): ProductDto {
    return {
      business: {
        id: product.business.id,
      },
      channelSet: {
        id: product.channelSet.id,
      },
      id: product.id,
      imports: product.imports,
    };
  }
}
