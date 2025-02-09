import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from '../services';
import { RabbitEventNameEnum } from '../../environments/rabbitmq';
import { PlanSubscribeDto } from '../dto/billing-subscription';
import { MessageBusChannelsEnum } from '../../shared';

@Controller()
export class BillingSubscriptionMessageBusController {
  constructor(private readonly productService: ProductService) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.BillingSubscriptionsPlanSubscribe,
  })
  public async planSubscribed(payloadDto: PlanSubscribeDto): Promise<void> {
    await this.productService.lockProduct(payloadDto.productId, payloadDto.businessId);
  }
}
