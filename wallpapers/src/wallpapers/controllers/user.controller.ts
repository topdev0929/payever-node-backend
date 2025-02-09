import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum, User, UserTokenInterface } from '@pe/nest-kit/modules/auth';

import { CreateWallpaperDto } from '../dto';
import { UserWallpapersModel } from '../models';
import { UserWallpapersService } from '../services';

@Controller('personal/wallpapers')
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.user)
export class UserController {

  constructor(
    private readonly wallpapersService: UserWallpapersService,
  ) {
  }

  @Get('')
  public async getWallpapersList(
    @User() user: UserTokenInterface,
  ): Promise<UserWallpapersModel> {
    return this.wallpapersService.findByUser(user.id);
  }

  @Post('')
  public async addWallpaper(
    @User() user: UserTokenInterface,
    @Body() createWallpaperDto: CreateWallpaperDto,
  ): Promise<UserWallpapersModel> {
    return this.wallpapersService.addWallpaper(
      user.id,
      createWallpaperDto,
    );
  }

  @Post('active')
  public async setCurrent(
    @User() user: UserTokenInterface,
    @Body() createWallpaperDto: CreateWallpaperDto,
  ): Promise<void> {
    await this.wallpapersService.setCurrent(
      user.id,
      createWallpaperDto,
    );
  }

  @Delete('active')
  public async resetCurrent(
    @User() user: UserTokenInterface,
  ): Promise<void> {
    await this.wallpapersService.resetCurrent(
      user.id,
    );
  }

  @Delete(':wallpaper')
  public async deleteWallpaper(
    @User() user: UserTokenInterface,
    @Param('wallpaper') wallpaper: string,
  ): Promise<void> {
    await this.wallpapersService.deleteWallpaper(user.id, wallpaper);
  }
}
