import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CheckoutService } from '../services';
import { BusinessService } from '@pe/business-kit';
import { SetupCheckoutInterface } from '../interfaces';
import { CheckoutModel } from '../models';
import { MessageBusChannelsEnum } from '../../environments';

@Controller()
export class CheckoutConsumer {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly businessService: BusinessService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: 'onboarding.event.setup.checkout',
  })
  public async setupCheckout(
    data: SetupCheckoutInterface,
  ): Promise<void> {
    const business: any = await this.businessService.findOneById(data.businessId);
    
    if (!business) {
      await this.addToPending(data);

      return;
    }
    const checkout: CheckoutModel = await this.checkoutService.findDefaultForBusiness(business);

    if (!checkout) {
      await this.addToPending(data);
      
      return;
    }

    await this.checkoutService.setupCheckout(data, business, checkout);
  }

  private async addToPending(data: SetupCheckoutInterface): Promise<void> {
    await this.checkoutService.addPendingInstallation({ businessId: data.businessId, payload: data });
  }
}

