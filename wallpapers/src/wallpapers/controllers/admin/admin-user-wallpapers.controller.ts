import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { AdminCreateUserWallpaperDto, AdminSetUserWallpaperDto, AdminUserDto, AdminUserWallpapersListDto } from '../../dto';
import { UserWallpapersModel } from '../../models';
import { UserWallpapersService } from '../../services';

/**
 * Admin endpoints to manage BusinessWallpapers
 */
@Controller('admin/user-wallpapers')
@ApiTags('admin-user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminUserWallpapersController {
  constructor(
    private readonly userWallpapersService: UserWallpapersService,
  ) { }

  @Get()
  public async getWallpapers(
    @Query() dto: AdminUserWallpapersListDto,
  ): Promise<any> {
    return this.userWallpapersService.retrieveListForAdmin(dto);
  }

  @Post()
  public async addWallpaper(
    @Body() createWallpaperDto: AdminCreateUserWallpaperDto,
  ): Promise<UserWallpapersModel> {
    return this.userWallpapersService.addWallpaper(
      createWallpaperDto.userId,
      createWallpaperDto,
    );
  }

  @Post('active')
  public async setCurrent(
    @Body() createWallpaperDto: AdminCreateUserWallpaperDto,
  ): Promise<UserWallpapersModel> {
    return this.userWallpapersService.setCurrent(
      createWallpaperDto.userId,
      createWallpaperDto,
    );
  }

  @Patch()
  public async setUserWallpapers(
    @Body() updateDto: AdminSetUserWallpaperDto,
  ): Promise<UserWallpapersModel> {
    return this.userWallpapersService.setWallpapers(
      updateDto.userId,
      updateDto.wallpapers,
    );
  }

  @Delete('active')
  public async resetCurrent(
    @Body() dto: AdminUserDto,
  ): Promise<UserWallpapersModel> {
    return this.userWallpapersService.resetCurrent(
      dto.userId,
    );
  }

  @Delete(':wallpaper')
  public async deleteWallpaper(
    @Param('wallpaper') wallpaper: string,
    @Body() dto: AdminUserDto,
  ): Promise<UserWallpapersModel> {
    return this.userWallpapersService.deleteWallpaper(dto.userId, wallpaper);
  }
}
