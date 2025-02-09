import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SubscriptionService } from '../services';
import { SubscriptionRabbitMessagesEnum } from '../enums';
import { SubscriptionDto } from '../dto';
import { SubscriptionModel } from '../models';

@Controller()
export class SubscriptionMessagesConsumer {
  constructor(
    private readonly subscriptionService: SubscriptionService,
  ) { }

  @MessagePattern({
    name: SubscriptionRabbitMessagesEnum.SubscriptionCreated,
  })
  public async onSubscriptionCreated(data: SubscriptionDto): Promise<void> {
    await this.subscriptionService.createSubscription(data);
  }

  @MessagePattern({
    name: SubscriptionRabbitMessagesEnum.SubscriptionRemoved,
  })
  public async onSubscriptionUpdated(data: SubscriptionDto): Promise<void> {
    await this.subscriptionService.deleteSubscription(data._id);
  }

  @MessagePattern({
    name: SubscriptionRabbitMessagesEnum.SubscriptionExported,
  })
  public async onSubscriptionExported(data: SubscriptionDto): Promise<void> {
    const subscription: SubscriptionModel = await this.subscriptionService.findById(data._id);

    if (subscription) {
      return;
    }

    await this.subscriptionService.createSubscription(data);
  }

}
