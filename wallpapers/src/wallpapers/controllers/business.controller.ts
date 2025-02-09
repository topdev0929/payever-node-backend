import {
  Body, Controller, Delete, Get, Param, Post, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';

import { CreateWallpaperDto } from '../dto';
import { BusinessWallpapersModel } from '../models';
import { BusinessWallpapersService } from '../services';

@Controller('business/:businessId/wallpapers')
@ApiTags('business')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class BusinessController {

  constructor(
    private readonly wallpapersService: BusinessWallpapersService,
  ) {
  }

  @Get('')
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  public async getWallpapersList(
    @Param('businessId') businessId: string,
  ): Promise<BusinessWallpapersModel>  {
    return this.wallpapersService.findByBusiness(businessId);
  }

  @Post('')
  @Acl({ microservice: 'settings', action: AclActionsEnum.create })
  public async addWallpaper(
    @Param('businessId') businessId: string,
    @Body() createWallpaperDto: CreateWallpaperDto,
  ): Promise<BusinessWallpapersModel> {
    return this.wallpapersService.addWallpaper(
      businessId,
      createWallpaperDto,
    );
  }

  @Post('active')
  @Acl({ microservice: 'settings', action: AclActionsEnum.update })
  public async setCurrent(
    @Param('businessId') businessId: string,
    @Body() createWallpaperDto: CreateWallpaperDto,
  ): Promise<void> {
    await this.wallpapersService.setCurrent(
      businessId,
      createWallpaperDto,
    );
  }

  @Delete('active')
  @Acl({ microservice: 'settings', action: AclActionsEnum.update })
  public async resetCurrent(
    @Param('businessId') businessId: string,
  ): Promise<void> {
    await this.wallpapersService.resetCurrent(
      businessId,
    );
  }

  @Delete(':wallpaper')
  @ApiBearerAuth()
  @Acl({ microservice: 'settings', action: AclActionsEnum.delete })
  public async deleteWallpaper(
    @Param('businessId') businessId: string,
    @Param('wallpaper') wallpaper: string,
  ): Promise<void> {
    await this.wallpapersService.deleteWallpaper(businessId, wallpaper);
  }
}
