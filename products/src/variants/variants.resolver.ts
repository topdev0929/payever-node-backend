import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ProductInterface } from '../new-products/interfaces/product.interface';
import { VariantInterface } from './interfaces/variant.interface';
import { VariantsService } from './variants.service';

@Resolver('Product')
export class VariantsResolver {
  constructor(private readonly variantsService: VariantsService) { }

  @ResolveField()
  public async variants(@Parent() product: ProductInterface): Promise<VariantInterface[]> {
    if (!product.variants || product.variants.length === 0) {
      return [];
    }

    const variantIds: string[] = [];

    for (const variant of product.variants) {
      if (typeof variant === 'string') {
        variantIds.push(variant);
      } else {
        variantIds.push(variant.id);
      }
    }

    return this.variantsService.getMany(variantIds);
  }
}
