import { Injectable, Logger } from '@nestjs/common';
import { IntegrationSubscriptionModel } from '../../integration';
import { BusinessModel } from '../../business/models';
import { ShippingTaskModel } from '../models/shipping-task.model';
import { InnerEventProducer } from '../producer/inner.event.producer';
import { ShippingTaskService } from './shipping-task.service';

@Injectable()
export class ShippingTriggerService {
  constructor(
    private readonly innerEventProducer: InnerEventProducer,
    private readonly shippingTaskService: ShippingTaskService,
    private readonly logger: Logger,
  ) { }

  public async triggerShippingDataSync(
    integrationSubscription: IntegrationSubscriptionModel,
    business: BusinessModel,
  ): Promise<void> {
    const task: ShippingTaskModel = await this.shippingTaskService.createFromShipping(
      integrationSubscription,
      business,
    );

    this.logger.log(`trigger sync shipping data ${task}`);
    await this.innerEventProducer.triggerInwardProductsSynchronize(
      business,
      integrationSubscription,
      task,
    );
  }
}
