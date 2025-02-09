import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductSettingsModel } from '../models';
import { ProductNotificationsService } from './product-notifications.service';

@Injectable()
export class ProductSettingsService {
  constructor(
    @InjectModel('ProductSettings')
    private readonly productSettingsModel: Model<ProductSettingsModel>,
    private readonly productNotificationService: ProductNotificationsService,
  ) { }

  public async getProductSettings(businessId: string): Promise<any> {
    let settings: ProductSettingsModel =
      await this.productSettingsModel.findOne({ businessIds: businessId }).exec();

    if (!settings) {
      settings = await this.createProductSettings(businessId, undefined);
    }

    return settings.settings;
  }

  public async getCurrency(businessId: string): Promise<string> {
    const productSettings: ProductSettingsModel =
      await this.productSettingsModel.findOne({ businessIds: businessId }).exec();

    return productSettings ? productSettings.settings.currency : 'EUR';
  }

  public async createProductSettings(businessId: string, currency: string ): Promise<ProductSettingsModel> {
    const settings: ProductSettingsModel = await this.productSettingsModel
      .create({
        businessIds: [businessId],
        settings: {
          currency,
          welcomeShown: false,
        },
      } as ProductSettingsModel);

    await this.productNotificationService.sendAddProductNotification(businessId);

    return settings;
  }

  public async setWelcomeShown(businessId: string): Promise<any> {
    await this.productSettingsModel
      .findOneAndUpdate({ businessIds: businessId }, { $set: { 'settings.welcomeShown': true } })
      .exec();
  }

  public async setCurrency(businessId: string, currency: string): Promise<ProductSettingsModel> {
    return this.productSettingsModel
      .findOneAndUpdate(
        { businessIds: businessId },
        { $set: { 'settings.currency': currency } },
      )
      .exec();
  }

  public async removeByBusinessId(businessId: string): Promise<void> {
    await this.productSettingsModel.deleteMany({ businessIds: businessId });
  }

  public async getSizeUnit(businessId: string): Promise<string> {
    const productSettings: ProductSettingsModel =
      await this.productSettingsModel.findOne({ businessIds: businessId }).exec();

    return productSettings && productSettings.settings.measureMass
      ? productSettings.settings.measureSize
      : 'cm';
  }

  public async getMassUnit(businessId: string): Promise<string> {
    const productSettings: ProductSettingsModel =
      await this.productSettingsModel.findOne({ businessIds: businessId }).exec();

    return productSettings && productSettings.settings.measureMass
      ? productSettings.settings.measureMass
      : 'kg';
  }
}
