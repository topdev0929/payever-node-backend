import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SettingsDto } from '../dto';
import { RabbitMessagesEnum, MessageBusChannelsEnum } from '../enum';
import { BusinessModel } from '../interfaces';
import { BusinessSchemaName } from '../schemas';
import { RabbitProducer } from '../services';

@Controller()
export class OnboardingBusMessageController {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly rabbitService: RabbitProducer,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.devicePayments,
    name: RabbitMessagesEnum.OnboardingSetupDevicePayments,
  })
  public async setupDevicePayments(data: { settingsData: SettingsDto; businessId: string }): Promise<void> {

    const { settingsData, businessId }: any = data;
    const business: BusinessModel = await this.businessModel.findOne({ _id: businessId });

    if (!(business && business.settings && business.settings.enabled)) {
      return;
    }

    business.settings = {
      enabled: business.settings.enabled,
      ...settingsData,
    };
    await business.save();
    await this.rabbitService.settingsUpdated(business);
  }
}
