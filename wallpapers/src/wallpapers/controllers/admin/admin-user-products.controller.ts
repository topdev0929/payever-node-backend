import { Body, Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { UserProductModel } from 'src/wallpapers/models';
import { AdminProductDto, UpdateProductWallpaperDto } from '../../dto';
import { UserProductsService } from '../../services';

@Controller('admin/user-products')
@ApiTags('admin/user-products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminUserProductsController {
  constructor(
    private readonly userProductWallpapersService: UserProductsService,
  ) {
  }

  @Patch()
  public async updateProductIndustryWallpapers(
    @Body() updateDto: UpdateProductWallpaperDto,
  ): Promise<UserProductModel> {
    return this.userProductWallpapersService.updateWallpaperByProductAndIndustry(
      updateDto.industry_code,
      updateDto.product_code,
      updateDto.wallpapers,
    );
  }

  @Delete(':wallpaper')
  public async deleteWallpaper(
    @Param('wallpaper') wallpaper: string,
    @Body() dto: AdminProductDto,
  ): Promise<UserProductModel> {
    return this.userProductWallpapersService.deleteWallpaper(dto.product_code, wallpaper);
  }
}
