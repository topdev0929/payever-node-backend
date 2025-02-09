import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductAlbumService } from '../../services';
import { PaginationDto } from '../../../common/dto';
import { ProductsPaginatedInterface } from '../../interfaces';

@Resolver()
export class ProductAlbumResolver {
  constructor(
    private readonly productAlbumService: ProductAlbumService,
  ) { }

  @Query()
  public async getProductNoAlbum(
    @Args('businessId') businessId: string,
    @Args('pagination') pagination: PaginationDto,
  ): Promise<ProductsPaginatedInterface> {
    return this.productAlbumService.getProductByAlbum(null, businessId, pagination);
  }

  @Query()
  public async getProductByAlbum(
    @Args('albumId') albumId: string,
    @Args('businessId') businessId: string,
    @Args('pagination') pagination: PaginationDto,
  ): Promise<ProductsPaginatedInterface> {
    return this.productAlbumService.getProductByAlbum(albumId, businessId, pagination);
  }

  @Mutation()
  public async linkProductToAlbum(
    @Args('albumId') albumId: string,
    @Args('businessId') businessId: string,
    @Args('productId') productId: string,
  ): Promise<boolean> {
    try {
      await this.productAlbumService.linkProductToAlbum(
        albumId,
        businessId,
        productId,
      );

      return true;
    } catch (e) {
      return false;
    }
  }

  @Mutation()
  public async unlinkProductFromAlbum(
    @Args('businessId') businessId: string,
    @Args('productId') productId: string,
  ): Promise<boolean> {
    try {
      await this.productAlbumService.unlinkProductFromAlbum(
        businessId,
        productId,
      );

      return true;
    } catch (e) {
      return false;
    }
  }

  @Mutation()
  public async linkProductToAlbumForBuilder(
    @Args('filter') filter: string,
    @Args('business') business?: string,
  ): Promise<any> {
    try {
      await this.productAlbumService.linkProductToAlbumForBuilder(business, filter);

      return true;
    } catch (e) {
      return false;
    }
  }

  @Mutation()
  public async unlinkProductFromAlbumForBuilder(
    @Args('filter') filter: string,
    @Args('business') business?: string,
  ): Promise<any> {
    try {
      await this.productAlbumService.unlinkProductFromAlbumForBuilder(business, filter);

      return true;
    } catch (e) {
      return false;
    }
  }
}
