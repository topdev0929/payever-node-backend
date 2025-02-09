import { Query, Resolver, Args } from '@nestjs/graphql';
import { ProductRecommendationsService } from '../../services';
import { PaginationDto, ProductRecommendationDto } from '../../dto';

@Resolver()
export class ProductRecommendationsResolver {
  constructor(
    private readonly productRecommendationsService: ProductRecommendationsService,
  ) { }

  @Query()
  public async getRecommendations(
    @Args('businessUuid') businessUuid: string,
    @Args('tagFilter') tagFilter?: string,
    @Args('pageNumber') pageNumber?: number,
    @Args('paginationLimit') paginationLimit?: number,
  ): Promise<ProductRecommendationDto[]> {
    const pagination: PaginationDto = {
      limit: paginationLimit || 100,
      page: pageNumber || 1,
    };

    return this.productRecommendationsService.getRecommendations(businessUuid, tagFilter, pagination);
  }

  @Query()
  public async getProductRecommendations(
    @Args('id') id: string,
  ): Promise<ProductRecommendationDto> {
    return this.productRecommendationsService.getProductRecommendations(id);
  }
}
