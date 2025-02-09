import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessService, BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { ChannelSetModel } from '../models';
import { ChannelSetRabbitProducer } from '../producers';
import { ChannelSetService } from '../services';
import { CheckoutDbService } from '../../common/services';
import { CheckoutModel } from '../../checkout/models';
import { CheckoutEvent } from '../../checkout/enums';

@Injectable()
export class ChannelSetEventsListener {
  constructor(
    private readonly channelSetService: ChannelSetService,
    private readonly businessService: BusinessService,
    @Inject(forwardRef(() => CheckoutDbService))
    private readonly checkoutDbService: CheckoutDbService,
    private readonly channelSetRabbitProducer: ChannelSetRabbitProducer,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await business.populate('channelSets').execPopulate();
    await this.removeChannelSets(business.channelSets as ChannelSetModel[]);
  }

  @EventListener(CheckoutEvent.CheckoutRemoved)
  public async handleCheckoutRemoved(checkout: CheckoutModel): Promise<void> {
    const channelSets: ChannelSetModel[] = await this.channelSetService.findAllByCheckout(checkout);
    if (channelSets.length) {
      const createdByDefaultChannelSets: ChannelSetModel[] =
        channelSets.filter((x: ChannelSetModel) => x.enabledByDefault ? x.enabledByDefault : false);
      await this.removeChannelSets(createdByDefaultChannelSets);
      await this.sendUnlinkedChannelSetEvents(createdByDefaultChannelSets, checkout);

      await this.moveCommonChannelSetsDefaultCheckout(
        channelSets.filter((x: ChannelSetModel) => !(x.enabledByDefault ? x.enabledByDefault : false)),
        checkout,
      );
    }
  }

  private async removeChannelSets(channelSets: ChannelSetModel[]): Promise<void> {
    const tasks: Array<Promise<void>> = [];
    for (const channelSet of channelSets) {
      tasks.push(this.channelSetService.deleteOneById(channelSet.id));
    }

    await Promise.all(tasks);
  }

  private async sendUnlinkedChannelSetEvents(
    removedChannelSets: ChannelSetModel[],
    checkout: CheckoutModel,
  ): Promise<void> {
    const unlinkSends: Array<Promise<void>> = [];
    for (const channelSet of removedChannelSets) {
      unlinkSends.push(this.channelSetRabbitProducer.channelSetUnlinked(checkout.id, channelSet.id));
    }

    await Promise.all(unlinkSends);
  }

  private async moveCommonChannelSetsDefaultCheckout(
    channelSets: ChannelSetModel[],
    deletedCheckout: CheckoutModel,
  ): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(deletedCheckout.businessId) as BusinessModel;
    if (!business) {
      return ;
    }

    const defaultCheckout: CheckoutModel = await this.checkoutDbService.findDefaultForBusiness(business);

    const checkoutSetups: Array<Promise<void>> = [];
    for (const channelSet of channelSets) {
      checkoutSetups.push(this.channelSetService.setCheckout(channelSet, defaultCheckout));
    }

    await Promise.all(checkoutSetups);
  }
}
