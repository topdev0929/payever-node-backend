import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import {
  BusinessWallpapersModel,
  UserWallpapersModel,
  BusinessProductModel,
  BusinessProductIndustryModel,
  UserProductModel,
  UserProductIndustryModel,
} from '../../src/wallpapers/models';
import {
  BusinessWallpapersSchemaName,
  UserWallpapersSchemaName,
  BusinessProductSchemaName,
  BusinessProductIndustrySchemaName,
  UserProductSchemaName,
  UserProductIndustrySchemaName,
} from '../../src/wallpapers/schemas';

class BusinessWallpapersFixture extends BaseFixture {
  private readonly businessWallpapersModel: Model<BusinessWallpapersModel> =
    this.application.get(getModelToken(BusinessWallpapersSchemaName));
  private readonly userWallpapersModel: Model<UserWallpapersModel> =
    this.application.get(getModelToken(UserWallpapersSchemaName));
  private readonly businessProductModel: Model<BusinessProductModel> =
    this.application.get(getModelToken(BusinessProductSchemaName));
  private readonly businessProductIndustryModel: Model<BusinessProductIndustryModel> =
    this.application.get(getModelToken(BusinessProductIndustrySchemaName));
  private readonly userProductModel: Model<UserProductModel> =
    this.application.get(getModelToken(UserProductSchemaName));
  private readonly userProductIndustryModel: Model<UserProductIndustryModel> =
    this.application.get(getModelToken(UserProductIndustrySchemaName));

  public async apply(): Promise<void> {
    await this.businessWallpapersModel.create({
      _id: '5c8bce42-c03b-41a5-8c15-936a74d2a461',
      businessId: '593d0945-5539-4922-892e-b355d1f73c53',
      myWallpapers: [
        {
          theme: 'dark',
          wallpaper: 'wallpaper-1',
        },
        {
          theme: 'dark',
          wallpaper: 'wallpaper-2',
        },
        {
          theme: 'light',
          wallpaper: 'wallpaper-3',
        },
      ],
      currentWallpaper: {
        theme: 'light',
        wallpaper: 'wallpaper-3',
      },
    });

    await this.userWallpapersModel.create({
      _id: '5c8bce42-c03b-41a5-8c15-936a74d2a461',
      user: '593d0945-5539-4922-892e-b355d1f73c52',
      myWallpapers: [
        {
          theme: 'dark',
          wallpaper: 'wallpaper-1',
        },
        {
          theme: 'dark',
          wallpaper: 'wallpaper-2',
        },
        {
          theme: 'light',
          wallpaper: 'wallpaper-3',
        },
      ],
      currentWallpaper: {
        theme: 'light',
        wallpaper: 'wallpaper-3',
      },
    });

    await this.businessProductModel.create({
      _id: '5c8bce42-c03b-41a5-8c15-936a74d2a462',
      code: 'BRANCHE_COACHING',
      industry: '5c8bce42-c03b-41a5-8c15-936a74d2a463',
      wallpapers: [
        {
          theme: 'dark',
          wallpaper: 'wallpaper-1',
        },
        {
          theme: 'dark',
          wallpaper: 'wallpaper-2',
        },
        {
          theme: 'light',
          wallpaper: 'wallpaper-3',
        },
      ]
    });

    await this.businessProductModel.create({
      _id: 'dac8cff5-dfc5-4461-b0e3-b25839527304',
      code: 'BRANCHE_COACHING',
      industry: 'a17cb8fb-cc8d-4f5c-9a0d-75f144651dfb',
      wallpapers: [
        {
          theme: 'dark',
          wallpaper: 'wallpaper-1',
        },
        {
          theme: 'dark',
          wallpaper: 'wallpaper-2',
        },
        {
          theme: 'light',
          wallpaper: 'wallpaper-3',
        },
      ]
    });

    await this.businessProductIndustryModel.create({
      _id: '5c8bce42-c03b-41a5-8c15-936a74d2a463',
      // code: '593d0945-5539-4922-892e-b355d1f73c52',
      code: 'BUSINESS_PRODUCT_SERVICES',
      icon: '',
      order: 1,
    });

    await this.businessProductModel.create({
      _id: '5c8bce42-c03b-41a5-8c15-936a74d2a468',
      // code: 'BUSINESS_PRODUCT_OTHERS',
      code: 'BRANCHE_OTHER',
      industry: '5c8bce42-c03b-41a5-8c15-936a74d2a469',
      wallpapers: [
        {
          theme: 'dark',
          wallpaper: 'wallpaper-1',
        },
        {
          theme: 'dark',
          wallpaper: 'wallpaper-2',
        },
        {
          theme: 'light',
          wallpaper: 'wallpaper-3',
        },
      ]
    });

    await this.businessProductModel.create({
      _id: '8098d34f-04ee-431f-b336-6d6afb1d5203',
      // code: 'BUSINESS_PRODUCT_OTHERS',
      code: 'BRANCHE_OTHER',
      industry: '1027cb6b-4a98-43c3-a2ee-2937efe8bf63',
      wallpapers: [
        {
          theme: 'dark',
          wallpaper: 'wallpaper-1',
        },
        {
          theme: 'dark',
          wallpaper: 'wallpaper-2',
        },
        {
          theme: 'light',
          wallpaper: 'wallpaper-3',
        },
      ]
    });

    await this.businessProductModel.create({
      _id: 'bf178385-ae0c-42af-a026-4763013be70b',
      // code: 'BUSINESS_PRODUCT_OTHERS',
      code: 'BRANCHE_OTHER',
      industry: '81b9e5f1-99a1-4cae-8c71-8b6ed3eb24e2',
      wallpapers: [
        {
          theme: 'dark',
          wallpaper: 'wallpaper-1',
        },
        {
          theme: 'dark',
          wallpaper: 'wallpaper-2',
        },
        {
          theme: 'light',
          wallpaper: 'wallpaper-3',
        },
      ]
    });

    await this.businessProductIndustryModel.create(
      {
        _id: '5c8bce42-c03b-41a5-8c15-936a74d2a469',
        code: 'BUSINESS_PRODUCT_SERVICES',
        icon: 'others',
        order: 1,
      },
      {
        _id: '1027cb6b-4a98-43c3-a2ee-2937efe8bf63',
        code: 'BRANCHE_OTHER',
        icon: 'others',
        order: 2,
      },
      {
        _id: 'a17cb8fb-cc8d-4f5c-9a0d-75f144651dfb',
        code: 'BRANCHE_COACHING',
        icon: 'others',
        order: 3,
      },
      {
        _id: '81b9e5f1-99a1-4cae-8c71-8b6ed3eb24e2',
        code: 'BUSINESS_PRODUCT_OTHERS',
        icon: 'others',
        order: 3,
      }
    );

    await this.userProductModel.create({
      _id: '5c8bce42-c03b-41a5-8c15-936a74d2a462',
      code: 'BRANCHE_COACHING',
      industry: '5c8bce42-c03b-41a5-8c15-936a74d2a463',
      wallpapers: [
        {
          theme: 'dark',
          wallpaper: 'wallpaper-1',
        },
        {
          theme: 'dark',
          wallpaper: 'wallpaper-2',
        },
        {
          theme: 'light',
          wallpaper: 'wallpaper-3',
        },
      ]
    });

    await this.userProductIndustryModel.create({
      _id: '5c8bce42-c03b-41a5-8c15-936a74d2a463',
      // code: '593d0945-5539-4922-892e-b355d1f73c52',
      code: 'BUSINESS_PRODUCT_SERVICES',
      icon: '',
      order: 1,
    });

    await this.userProductModel.create({
      _id: '5c8bce42-c03b-41a5-8c15-936a74d2a468',
      // code: 'BUSINESS_PRODUCT_OTHERS',
      code: 'BRANCHE_OTHER',
      industry: '5c8bce42-c03b-41a5-8c15-936a74d2a469',
      wallpapers: [
        {
          theme: 'dark',
          wallpaper: 'wallpaper-1',
        },
        {
          theme: 'dark',
          wallpaper: 'wallpaper-2',
        },
        {
          theme: 'light',
          wallpaper: 'wallpaper-3',
        },
      ]
    });

    await this.userProductIndustryModel.create({
      _id: '5c8bce42-c03b-41a5-8c15-936a74d2a469',
      // code: 'BRANCHE_OTHER',
      code: 'BUSINESS_PRODUCT_OTHERS',
      icon: 'others',
      order: 1,
    });
  }
}

export = BusinessWallpapersFixture;
