import { Resolver, Query, Args } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductInterface } from './interfaces/product.interface';
import { VariantsService } from '../variants/variants.service';
import { VariantInterface } from '../variants/interfaces/variant.interface';

@Resolver('Product')
export class ProductResolver {
  constructor(private readonly productService: ProductService, private readonly variantsService: VariantsService) { }

  @Query()
  public async product(@Args('id') id: string, @Args('uuid') uuid: string): Promise<ProductInterface> {
    return this.productService.get(id || uuid);
  }

  @Query()
  public async getProductsByIdsOrVariantIds(@Args('ids') ids: string[]): Promise<ProductInterface[]> {
    const variants: VariantInterface[] = await this.variantsService.getMany(ids);
    const variantProducts: string[] = variants.map((x: VariantInterface) => x.product);
    const productIds: string[] = [...new Set<string>([...ids, ...variantProducts])];

    return this.productService.getMany(productIds);
  }

  @Query()
  public async getProductsByBusiness(@Args('businessUuid') businessUuid: string): Promise<ProductInterface[]> {
    return this.productService.getProductsByBusiness(businessUuid);
  }
}
