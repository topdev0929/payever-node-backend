import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { AbstractGqlResolver, GqlAuthGuard } from '@pe/graphql-kit';
import { Roles, RolesEnum } from '@pe/nest-kit';
import { AlbumService } from '../../services';
import { AlbumModel } from '../../models';
import { PaginationDto } from '../../../common/dto';
import { AlbumDto } from '../../dto';
import { ResultInterface } from '../../interfaces';

@Resolver('Album')
@UseGuards(GqlAuthGuard)
@Roles(RolesEnum.anonymous)
export class AlbumResolver extends AbstractGqlResolver {
  constructor(
    private readonly albumService: AlbumService,
  ) { super(); }

  @Query() public async getAlbum(
    @Args('businessId') businessId: string,
    @Args('pagination') pagination: PaginationDto,
  ): Promise<AlbumModel[]> {
    const data: ResultInterface = await this.albumService.findByBusinessId(pagination, businessId);

    return data.result;
  }

  @Query() public async findAlbumById(
    @Args('albumId') albumId: string,
    @Args('businessId') businessId: string,
  ): Promise<AlbumModel> {
    return this.albumService.findById(albumId, businessId);
  }

  @Query() public async findAlbumByParent(
    @Args('albumId') albumId: string,
    @Args('businessId') businessId: string,
    @Args('pagination') pagination: PaginationDto,
  ): Promise<AlbumModel[]> {
    const data: ResultInterface = await this.albumService.findByBusinessId(pagination, businessId, albumId);

    return data.result;
  }

  @Query() public async findAlbumByAncestor(
    @Args('albumId') albumId: string,
    @Args('businessId') businessId: string,
    @Args('pagination') pagination: PaginationDto,
  ): Promise<AlbumModel[]> {
    const data: ResultInterface = await this.albumService.findByBusinessIdAndAncestor(pagination, businessId, albumId);

    return data.result;
  }

  @Mutation() public async createAlbum(
    @Args('businessId') businessId: string,
    @Args('album') album: AlbumDto,
  ): Promise<AlbumModel> {
    return this.albumService.create(businessId, album);
  }

  @Mutation() public async updateAlbum(
    @Args('albumId') albumId: string,
    @Args('businessId') businessId: string,
    @Args('album') album: AlbumDto,
  ): Promise<AlbumModel> {
    return this.albumService.update(albumId, businessId, album);
  }

  @Mutation() public async deleteAlbum(
    @Args('albumId') albumId: string,
    @Args('businessId') businessId: string,
  ): Promise<boolean> {
    return this.albumService.remove(albumId, businessId);
  }

  @Query()
  public async getAlbumForBuilder(
    @Args('filter') filter: string,
    @Args('businessId') businessId?: string,
    @Args('order') order?: string,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<any> {
    return this.albumService.getAlbumForBuilder(businessId, filter, order, offset, limit);
  }

  @Mutation()
  public async createAlbumForBuilder(
    @Args('filter') filter: string,
    @Args('businessId') businessId?: string,
  ): Promise<any> {
    return this.albumService.createAlbumForBuilder(businessId, filter);
  }
  @Mutation()
  public async updateAlbumForBuilder(
    @Args('filter') filter: string,
    @Args('businessId') businessId?: string,
  ): Promise<any> {
    return this.albumService.updateAlbumForBuilder(businessId, filter);
  }
  @Mutation()
  public async deleteAlbumForBuilder(
    @Args('filter') filter: string,
    @Args('businessId') businessId?: string,
  ): Promise<boolean> {
    return this.albumService.deleteAlbumForBuilder(businessId, filter);
  }
}
