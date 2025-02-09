import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';

import { ProductWallpapersDto, PaginationDto, SearchProductWallpapersDto } from '../dto';
import { WallpaperInterface } from '../interfaces';
import { BusinessProductModel } from '../models';
import { BusinessProductsService } from '../services';

@Controller('products/wallpapers')
@ApiTags('business-products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class BusinessProductsController {
  constructor(
    private readonly businessProductWallpapersService: BusinessProductsService,
  ) {
  }

  /**
   * @deprecated left for BC, because businessProducts and industries were switched up
   * @returns {Promise<BusinessProductModel[]>}
   */
  @Get()
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async getBusinessProductsWallpapersGroupedByIndustries(
  ): Promise<BusinessProductModel[]> {
    return this.businessProductWallpapersService.getAllBusinessProductGroupedByIndustry();
  }

  @Get('/all')
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async getBusinessProductsWallpapers(
    @Query() pagination: PaginationDto,
  ): Promise<ProductWallpapersDto[]> {
    return this.businessProductWallpapersService.getAllBusinessProductWallpapers(pagination);
  }

  @Get('/tree')
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async getBusinessProductsTree(
    @Query() pagination: PaginationDto,
  ): Promise<BusinessProductModel[]> {
    return this.businessProductWallpapersService.getAllBusinessProductstree();
  }

  @Get('/byId/:id')
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async getBusinessProductsWallpapersById(
    @Param('id') id: string,
    @Query() pagination: PaginationDto,
  ): Promise<WallpaperInterface[]> {
    return this.businessProductWallpapersService.getAllBusinessProductWallpapersById(pagination, id);
  }

  @Post('/search')
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async searchBusinessProductsWallpapers(
    @Query() pagination: PaginationDto,
    @Body() searchConditions: SearchProductWallpapersDto,
  ): Promise<WallpaperInterface[]> {
    return this.businessProductWallpapersService.searchAllBusinessProductWallpapers(pagination, searchConditions);
  }

}
