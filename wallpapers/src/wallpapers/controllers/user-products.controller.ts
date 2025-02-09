import { Body, Controller, Get, Query, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';

import { ProductWallpapersDto, PaginationDto, SearchProductWallpapersDto } from '../dto';
import { WallpaperInterface } from '../interfaces';
import { BusinessProductModel } from '../models';
import { UserProductsService } from '../services';

@Controller('user-products/wallpapers')
@ApiTags('user-products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.user)
export class UserProductsController {
  constructor(
    private readonly userProductWallpapersService: UserProductsService,
  ) {
  }

  @Get('/all')
  @Roles(RolesEnum.user)
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async getBusinessProductsWallpapers(
    @Query() pagination: PaginationDto,
  ): Promise<ProductWallpapersDto[]> {
    return this.userProductWallpapersService.getAllUserProductWallpapers(pagination);
  }

  @Get('/tree')
  @Roles(RolesEnum.user)
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async getBusinessProductsTree(
    @Query() pagination: PaginationDto,
  ): Promise<BusinessProductModel[]> {
    return this.userProductWallpapersService.getAllUserProductstree();
  }

  @Post('/search')
  @Roles(RolesEnum.user)
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async searchBusinessProductsWallpapers(
    @Query() pagination: PaginationDto,
    @Body() serachConditions: SearchProductWallpapersDto,
  ): Promise<WallpaperInterface[]> {
    return this.userProductWallpapersService.searchAllUserProductWallpapers(pagination, serachConditions);
  }

}
