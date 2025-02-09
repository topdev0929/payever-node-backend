import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { BusinessService } from '@pe/business-kit';
import { IntegrationSubscriptionDto } from '../dto';
import { BusinessIntegrationSubscriptionService, IntegrationService } from '../services';
import { EventDispatcher } from '@pe/nest-kit';
import { InternalEventsEnum } from '@pe/channels-sdk';

@Controller()
export class IntegrationBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly subscriptionService: BusinessIntegrationSubscriptionService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @MessagePattern({
    name: 'connect.event.third-party.exported',
  })
  public async onIntegrationSubscriptionsExported(integrationSubscription: IntegrationSubscriptionDto): Promise<void> {
    await validate(integrationSubscription);

    if (!integrationSubscription.installed) {
      return;
    }

    await this.eventDispatcher.dispatch(
      InternalEventsEnum.onIntegrationEnabledEvent,
      integrationSubscription,
    );
  }

}
