import { Resolver, Query, Args } from '@nestjs/graphql';
import { MarketplaceService } from '../../../marketplace/services';
import { MarketplaceInterface } from '../../../marketplace/interfaces';

@Resolver()
export class MarketplaceResolver {
  constructor(private readonly marketplaceService: MarketplaceService) { }

  @Query()
  public async getBusinessMarketplaces(@Args('businessId') businessId: string): Promise<MarketplaceInterface[]> {
    return this.marketplaceService.getBusinessMarketplaces2(businessId);
  }
}
