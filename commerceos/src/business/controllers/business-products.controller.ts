import { Controller, Get, NotFoundException, Param, Redirect, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessProductsService } from '../services';
import {
  BusinessProductIndustryModel,
  BusinessProductModel,
} from '../interfaces/entities';

const DEFAULT_WALLPAPER: string = 'https://payever.azureedge.net/images/commerseos-background-blurred.jpg';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.anonymous)
@Controller('business-products')
@ApiTags('business-products')
export class BusinessProductsController {
  constructor(
    readonly productService: BusinessProductsService,
  ) { }

  /**
   * @deprecated left for BC
   * @returns {Promise<BusinessProductIndustryInterface[]>}
   */
  @Get()
  public async getProductsGroupedByIndustries(): Promise<any[]> {
    return this.productService.getAllProductsGroupedByIndustry();
  }

  @Get('/list')
  public async getProductsList(): Promise<BusinessProductModel[]> {
    return this.productService.getAllProducts();
  }

  @Get(':industryName/industry')
  public async getIndustryProducts(
    @Param('industryName') industryName: string,
  ): Promise<BusinessProductModel[]> {
    const industry: BusinessProductIndustryModel = await this.productService.getIndustryByCode(industryName);

    if (!industry) {
      throw new NotFoundException(`Industry ${industryName} not found`);
    }

    return this.productService.getProductsByIndustry(industry);
  }

  @Get('wallpaper/:slug')
  @Redirect(DEFAULT_WALLPAPER)
  public async getProductIndustryWallpaper(
    @Param('slug') slug: string,
  ): Promise<any> {
    const wallpaper: string = await this.productService.getIndustryWallpaperBySlug(slug);

    return  wallpaper ? { url: wallpaper } : null;
  }
}
