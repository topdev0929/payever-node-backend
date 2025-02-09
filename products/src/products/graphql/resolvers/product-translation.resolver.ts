import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductTranslationService } from '../../services';

@Resolver()
export class ProductTranslationsResolver {
  constructor(
    private readonly productTranslationService: ProductTranslationService,
  ) { }

  @Query()
  public async getProductTranslation(
    @Args('productId') productId: string,
    @Args('language') language: string,
  ): Promise<any> {
    return this.productTranslationService.getProductTranslation(productId, language);
  }
}
