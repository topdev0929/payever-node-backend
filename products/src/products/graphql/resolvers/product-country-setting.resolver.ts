import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductCountrySettingService } from '../../services';

@Resolver()
export class ProductCountrySettingsResolver {
  constructor(
    private readonly productCountrySettingService: ProductCountrySettingService,
  ) { }

  @Query()
  public async getProductCountrySetting(
    @Args('productId') productId: string,
    @Args('country') country: string,
  ): Promise<any> {
    return this.productCountrySettingService.getProductCountrySetting(productId, country);
  }
}
