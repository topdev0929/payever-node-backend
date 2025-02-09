import { Injectable, Inject } from '@nestjs/common';
import {
  ChannelSetModel,
  ChannelSetSchemaName,
  CHANNEL_SET_SERVICE,
  ChannelSetServiceInterface,
} from '@pe/channels-sdk';
import { EventListener } from '@pe/nest-kit';
import { SubscriptionPlanModel } from '../../subscriptions/models';
import { PlanEventsEnum } from '../../subscriptions/enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChannelSetRemoverListener {
  constructor(
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetsService: ChannelSetServiceInterface,
    @InjectModel(ChannelSetSchemaName) private readonly channelSetsModel: Model<ChannelSetModel>,
  ) { }

  /**
   * @TODO: Recheck algorithm, looks like it will never work because of channelSet property is not populated
   */
  @EventListener(PlanEventsEnum.PlanDeleted)
  public async onPlanRemoved(plan: SubscriptionPlanModel): Promise<void> {
    if (plan.channelSet) {
      const channelSet: ChannelSetModel = await this.channelSetsModel.findOne({
        legacyId: plan.channelSet[0].legacyId,
      });
      await this.channelSetsService.deleteOneById(channelSet._id);
    }
  }
}
