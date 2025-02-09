import {
  Body, Controller, Delete, Get, Param, Post, UseGuards, Query, Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import {
  AdminBusinessWallpaperListDto, AdminCreateBusinessWallpaperDto, AdminBusinessDto,
  AdminSetBusinessWallpaperDto,
} from '../../dto';
import { BusinessWallpapersModel } from '../../models';
import { BusinessWallpapersService } from '../../services';

/**
 * Admin endpoints to manage BusinessWallpapers
 */
@Controller('admin/wallpapers')
@ApiTags('admin-wallpapers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminBusinessWallpapersController {
  constructor(
    private readonly businessWallpapersService: BusinessWallpapersService,
  ) { }

  @Get()
  public async getWallpapers(
    @Query() dto: AdminBusinessWallpaperListDto,
  ): Promise<BusinessWallpapersModel> {
    return this.businessWallpapersService.retrieveListForAdmin(dto);
  }

  @Post()
  public async addWallpaper(
    @Body() createWallpaperDto: AdminCreateBusinessWallpaperDto,
  ): Promise<BusinessWallpapersModel> {
    return this.businessWallpapersService.addWallpaper(
      createWallpaperDto.businessId,
      createWallpaperDto,
    );
  }

  @Post('active')
  public async setCurrent(
    @Body() createWallpaperDto: AdminCreateBusinessWallpaperDto,
  ): Promise<BusinessWallpapersModel> {
    return this.businessWallpapersService.setCurrent(
      createWallpaperDto.businessId,
      createWallpaperDto,
    );
  }

  @Patch()
  public async setBusinessWallpapers(
    @Body() updateDto: AdminSetBusinessWallpaperDto,
  ): Promise<BusinessWallpapersModel> {
    return this.businessWallpapersService.setWallpapers(
      updateDto.businessId,
      updateDto.wallpapers,
    );
  }

  @Delete('active')
  public async resetCurrent(
    @Body() dto: AdminBusinessDto,
  ): Promise<BusinessWallpapersModel> {
    return this.businessWallpapersService.resetCurrent(
      dto.businessId,
    );
  }

  @Delete(':wallpaper')
  public async deleteWallpaper(
    @Param('wallpaper') wallpaper: string,
    @Body() dto: AdminBusinessDto,
  ): Promise<BusinessWallpapersModel> {
    return this.businessWallpapersService.deleteWallpaper(dto.businessId, wallpaper);
  }
}
