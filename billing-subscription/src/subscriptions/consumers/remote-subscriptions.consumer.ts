import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RabbitBinding, RabbitChannelsEnum } from '../../environments';
import { InjectModel } from '@nestjs/mongoose';
import { SubscriptionSchemaName } from '../schemas';
import { Model } from 'mongoose';
import { SubscriptionModel } from '../models';
import { SubscriptionChangedDto } from '../dto';

@Controller()
export class RemoteSubscriptionsController {
  constructor(
    @InjectModel(SubscriptionSchemaName) private readonly subscriptionsModel: Model<SubscriptionModel>,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.BillingSubscription,
    name: RabbitBinding.SubscriptionEvent,
  })
  public async onSubscriptionEvent(dto: SubscriptionChangedDto): Promise<void> {
    await this.subscriptionsModel.findOneAndUpdate(
      { remoteSubscriptionId: dto.externalId},
      { $set: { trialEnd: dto.trialEnd}},
    );
  }
}
