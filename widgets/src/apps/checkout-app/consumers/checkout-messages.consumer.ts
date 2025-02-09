import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CheckoutService } from '../services';
import { CheckoutRabbitMessagesEnum } from '../enums';
import { CheckoutEventDto } from '../dto';

@Controller()
export class CheckoutMessagesConsumer {
  constructor(
    private readonly checkoutService: CheckoutService,
  ) { }

  @MessagePattern({
    name: CheckoutRabbitMessagesEnum.checkoutCreated,
  })
  public async onCheckoutCreated(data: CheckoutEventDto): Promise<void> {
    await this.checkoutService.createOrUpdateCheckoutFromEvent(data);
  }

  @MessagePattern({
    name: CheckoutRabbitMessagesEnum.checkoutUpdated,
  })
  public async onCheckoutUpdated(data: CheckoutEventDto): Promise<void> {
    await this.checkoutService.createOrUpdateCheckoutFromEvent(data);
  }

  @MessagePattern({
    name: CheckoutRabbitMessagesEnum.checkoutExport,
  })
  public async onCheckoutExport(data: CheckoutEventDto): Promise<void> {
    await this.checkoutService.createOrUpdateCheckoutFromEvent(data);
  }

  @MessagePattern({
    name: CheckoutRabbitMessagesEnum.checkoutRemoved,
  })
  public async onCheckoutDeleted(data: CheckoutEventDto): Promise<void> {
    await this.checkoutService.deleteCheckout(data);
  }
}
