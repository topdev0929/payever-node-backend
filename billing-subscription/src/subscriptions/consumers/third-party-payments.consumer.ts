import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitBinding, RabbitChannelsEnum } from '../../environments';
import { CheckoutPaymentRmqMessageDto } from '../dto';
import { Subscriptions } from '../services';

@Controller()
export class ThirdPartyPaymentsBusMessageController {
  constructor(
    private readonly subscriptionsService: Subscriptions,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.BillingSubscription,
    name: RabbitBinding.PaymentCreated,
  })
  public async onPaymentCreated(data: CheckoutPaymentRmqMessageDto): Promise<void> {
    await this.subscriptionsService.saveSubscriptionsFromTransaction(data.payment);
  }
}
