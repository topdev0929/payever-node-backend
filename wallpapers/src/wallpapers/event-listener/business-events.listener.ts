import { Injectable } from '@nestjs/common';

import { EventListener } from '@pe/nest-kit';
import { BusinessMessagesHooksEnum, BusinessDto } from '@pe/business-kit';
import { BusinessWallpapersModel, CountryCityWallpapersModel } from '../models';
import { BusinessProductsService, BusinessWallpapersService, CountryCityWallpapersService } from '../services';
import { WallpaperInterface } from '../interfaces';
import { BusinessRemoveDto } from '../dto';


@Injectable()
export class BusinessEventListener {
  constructor(
    private readonly businessWallpaperService: BusinessWallpapersService,
    private readonly businessProductWallpaperService: BusinessProductsService,
    private readonly countryCityWallpapersService: CountryCityWallpapersService,
  ) { }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreCreatedHook)
  public async onBusinessCreated(createBusinessDto: BusinessDto): Promise<void>  {
    if (createBusinessDto.companyDetails
        && createBusinessDto.companyDetails.product
        && createBusinessDto.companyDetails.industry) {

        await this.setBusinessRandomWallpaper(
          createBusinessDto,
          createBusinessDto.companyDetails.product,
          createBusinessDto.companyDetails.industry,
        );
      }
  }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreRemovedHook)
  public async onBusinessRemoved(removeBusinessDto: BusinessRemoveDto): Promise<void>  {
    return this.businessWallpaperService.deleteBusiness(removeBusinessDto._id);
  }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreUpdatedHook)
  public async onBusinessUpdated(updateBusinessDto: BusinessDto): Promise<void>  {
    const existBusinessWallpaperModel: BusinessWallpapersModel =
      await this.businessWallpaperService.findByBusiness(updateBusinessDto._id);

    if (!existBusinessWallpaperModel) {
      return ;
    }

    if (existBusinessWallpaperModel.type !== 'custom'
      && updateBusinessDto.companyDetails
      && updateBusinessDto.companyDetails.product
      && updateBusinessDto.companyDetails.industry
      && (updateBusinessDto.companyDetails.product !== existBusinessWallpaperModel.product
        || updateBusinessDto.companyDetails.industry !== existBusinessWallpaperModel.industry)) {

      await this.setBusinessRandomWallpaper(
        updateBusinessDto,
        updateBusinessDto.companyDetails.product,
        updateBusinessDto.companyDetails.industry,
      );
    }
  }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreExportHook)
  public async onBusinessExport(data: BusinessDto): Promise<void>  {
    await this.setBusinessRandomWallpaper(
        data,
        'BUSINESS_PRODUCT_OTHERS',
        'BRANCHE_OTHER',
      );
  }

  private async setBusinessRandomWallpaper(
    businessDto: BusinessDto,
    product: string,
    industry: string,
  ): Promise<void> {

    let randomWallpaper: WallpaperInterface;
    if (businessDto.companyAddress.city) {
      const countryCityWallpaper: CountryCityWallpapersModel =
        await this.countryCityWallpapersService.getCityWallpaper(businessDto.companyAddress.city);
      if (countryCityWallpaper) {
        randomWallpaper = countryCityWallpaper.wallpaper;
      }
    }

    if (!randomWallpaper && businessDto.companyDetails.industry) {
      const predefinedWallpapers: WallpaperInterface[] =
        await this.businessProductWallpaperService.getWallpaperByProductAndIndustry(industry, product);

      if (predefinedWallpapers) {
        randomWallpaper = predefinedWallpapers[Math.floor(Math.random() * predefinedWallpapers.length)];
      }
    }

    if (!randomWallpaper) {
      return ;
    }

    await this.businessWallpaperService.setCurrentByRandom(
      businessDto._id,
      randomWallpaper,
      product,
      industry,
    );
  }
}
