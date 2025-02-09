import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { PopulatedProductVariantModel1, ProductVariantModel } from '../../models/product-variant.model';
import { NotFoundException } from '@nestjs/common';
import { ProductVariantsService } from '../../services/product-variants.service';

@Resolver()
export class ProductVariantsResolver {
  constructor(private readonly variantsService: ProductVariantsService) { }

  @Mutation()
  public async createVariant(
    @Args('productId') productId: string,
    @Args('data') data: Partial<ProductVariantModel>,
  ): Promise<ProductVariantModel> {
    const variant: ProductVariantModel = await this.variantsService.createVariant(productId, data);
    if (!variant) {
      throw new NotFoundException(`Product "${productId}" is not found.`);
    }

    return variant;
  }

  @Mutation()
  public async updateVariant(
    @Args('id') id: string,
    @Args('data') data: Partial<ProductVariantModel>,
  ): Promise<ProductVariantModel> {
    const variant: ProductVariantModel = await this.variantsService.updateVariant(id, data);
    if (!variant) {
      throw new NotFoundException(`Variant "${id}" is not found.`);
    }

    return variant;
  }

  @Mutation()
  public async deleteVariant(@Args('id') id: string): Promise<PopulatedProductVariantModel1> {
    const variant: PopulatedProductVariantModel1 = await this.variantsService.deleteVariant(id);
    if (!variant) {
      throw new NotFoundException(`Variant "${id}" is not found.`);
    }

    return variant;
  }

  @Query()
  public async getVariant(@Args('id') id: string): Promise<ProductVariantModel> {
    const variant: ProductVariantModel = await this.variantsService.getVariant(id);
    if (!variant) {
      throw new NotFoundException(`Variant "${id}" is not found.`);
    }

    return variant;
  }
}
