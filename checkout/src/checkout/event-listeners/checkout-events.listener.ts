import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { CheckoutModel } from '../models';
import { CheckoutEvent } from '../enums';
import { CheckoutService, CheckoutElasticService } from '../services';
import { RabbitEventsProducer } from '../../common/producer';

@Injectable()
export class CheckoutEventsListener {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly checkoutElasticService: CheckoutElasticService,
    private readonly rabbitProducer: RabbitEventsProducer,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async handleBusinessCreated(business: BusinessModel): Promise<void> {
    await this.checkoutService.createDefaultIfNotExist(business);
  }

  @EventListener(CheckoutEvent.CheckAndCreateDefaultCheckout)
  public async checkDefaultCheckout(business: BusinessModel): Promise<void> {
    await this.checkoutService.createDefaultIfNotExist(business);
  }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async handleBusinessRemoved(businessModel: BusinessModel): Promise<void> {
    const deletePromises: Array<Promise<void>> = [];
    await businessModel.populate('checkouts').execPopulate();
    for (const checkout of businessModel.checkouts) {
      deletePromises.push(this.checkoutService.deleteOneById(checkout as CheckoutModel));
    }

    await Promise.all(deletePromises);
  }

  @EventListener(CheckoutEvent.CheckoutCreated)
  public async onCheckoutCreated(checkout: CheckoutModel): Promise<void> {
    await this.checkoutElasticService.saveIndex(checkout);
  }

  @EventListener(CheckoutEvent.CheckoutUpdated)
  public async onCheckoutUpdated(_originalCheckout: CheckoutModel, updatedCheckout: CheckoutModel): Promise<void> {
    await this.checkoutElasticService.saveIndex(updatedCheckout);
  }

  @EventListener(CheckoutEvent.CheckoutRemoved)
  public async onCheckoutRemoved(checkout: CheckoutModel): Promise<void> {
    await this.checkoutElasticService.saveIndex(checkout);
  }
}
