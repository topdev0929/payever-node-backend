import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { BusinessProductModel } from 'src/wallpapers/models';

import { AdminProductDto, UpdateProductWallpaperDto } from '../../dto';
import { BusinessProductsService } from '../../services';

@Controller('admin/business-products')
@ApiTags('admin/business-products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminBusinessProductsController {
  constructor(
    private readonly businessProductWallpapersService: BusinessProductsService,
  ) {
  }

  @Get(':productCode')
  public async getProductIndustriesWallpapers(
    @Param('productCode') productCode: string,
  ): Promise<any> {
    return this.businessProductWallpapersService.getByIndustryCode(productCode);
  }

  @Patch()
  public async updateProductIndustryWallpapers(
    @Body() updateDto: UpdateProductWallpaperDto,
  ): Promise<BusinessProductModel> {
    return this.businessProductWallpapersService.updateWallpaperByProductAndIndustry(
      updateDto.industry_code,
      updateDto.product_code,
      updateDto.wallpapers,
    );
  }

  @Delete(':wallpaper')
  public async deleteWallpaper(
    @Param('wallpaper') wallpaper: string,
    @Body() dto: AdminProductDto,
  ): Promise<BusinessProductModel> {
    return this.businessProductWallpapersService.deleteWallpaper(dto.product_code, wallpaper);
  }
}
