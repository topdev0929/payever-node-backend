import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CheckoutLinkedDto, CheckoutSettingUpdateDto } from '../dto';
import { MessageBusChannelsEnum, RabbitMessagesEnum } from '../enum';
import { ApplicationModel, BusinessModel, CheckoutModel } from '../interfaces';
import { ApplicationSchemaName, BusinessSchemaName, CheckoutSchemaName } from '../schemas';
import { PhoneNumberService } from '../services';
import { ApplicationService } from '../services/application.service';

@Controller()
export class CheckoutBusMessageController {
  constructor(
    @InjectModel(ApplicationSchemaName) private readonly applicationModel: Model<ApplicationModel>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    @InjectModel(CheckoutSchemaName) private readonly checkoutModel: Model<CheckoutModel>,
    private readonly phoneNumberService: PhoneNumberService,
    private readonly applicationService: ApplicationService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.devicePayments,
    name: RabbitMessagesEnum.CheckoutChannelSetLinked,
  })
  public async onCheckoutLinkedEvent(data: CheckoutLinkedDto): Promise<void> {
    await this.applicationModel.updateOne(
      { channelSetId: data.channelSetId },
      {
        $set: { checkout: data.checkoutId },
      },
    ).exec();

    await this.applicationService.setCheckout(data.channelSetId, data.checkoutId);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.devicePayments,
    name: RabbitMessagesEnum.CheckoutCreated,
  })
  public async onCheckoutSettingsCreatedEvent(data: CheckoutSettingUpdateDto): Promise<void> {
    await this.onCheckoutEvent(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.devicePayments,
    name: RabbitMessagesEnum.CheckoutUpdated,
  })
  public async onCheckoutSettingsUpdatedEvent(data: CheckoutSettingUpdateDto): Promise<void> {
    await this.onCheckoutEvent(data);
  }

  private async onCheckoutEvent(data: CheckoutSettingUpdateDto): Promise<void> {
    if (data.settings) {
      const update: any = {
        message: String(data.settings.message),
      };

      if (data.settings.phoneNumber) {
        update.phoneNumber = Number(data.settings.phoneNumber);
        const checkout: CheckoutModel = await this.checkoutModel.findById(data.checkoutId).exec();

        const business: BusinessModel = await this.applicationService.findBusinessByCheckout(checkout);
        if (business && data.settings.phoneNumber) {
          await this.phoneNumberService.setupPhoneNumber(
            String(Number(data.settings.phoneNumber)),
            business._id,
          );
        }
      }

      if (data.settings.keyword) {
        update.keyword = data.settings.keyword;
      }

      await this.checkoutModel.updateOne(
        { _id: data.checkoutId },
        { $set: update },
        {
          setDefaultsOnInsert: true,
          upsert: true,
        },
      );
    }
  }
}
