import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { MessageBusEventsEnum, MessageBusChannelsEnum } from '../enums';
import { CheckoutFormMetricsService, CheckoutMetricsService } from '../services';
import { PaymentFlowEventDto } from '../dto/payment-flow-event';

@Controller()
export class PaymentFlowBusMessageController {
  constructor(
    private readonly checkoutMetricsService: CheckoutMetricsService,
    private readonly checkoutFormMetricsService: CheckoutFormMetricsService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.PaymentFlowCreated,
  })
  public async onPaymentFlowCreatedEvent(data: { flow: PaymentFlowEventDto }): Promise<void> {
    await this.checkoutMetricsService.createMetricsFromCreatedFlow(data.flow);
    await this.checkoutFormMetricsService.createFormMetricsFromCreatedFlow(data.flow);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.PaymentFlowUpdated,
  })
  public async onPaymentFlowUpdatedEvent(data: { flow: PaymentFlowEventDto }): Promise<void> {
    await this.checkoutMetricsService.updateMetricsFromUpdatedFlow(data.flow);
    await this.checkoutFormMetricsService.updateFormMetricsFromUpdatedFlow(data.flow);
  }
}
