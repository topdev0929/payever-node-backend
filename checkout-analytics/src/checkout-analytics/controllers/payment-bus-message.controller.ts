import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { MessageBusEventsEnum, MessageBusChannelsEnum } from '../enums';
import { PaymentEventDto } from '../dto';
import { CheckoutMetricsService, PaymentService } from '../services';
import { TransactionsPaymentExportDto } from '../dto/transactions-event';

@Controller()
export class PaymentBusMessageController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly checkoutMetricsService: CheckoutMetricsService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.PaymentCreated,
  })
  public async onPaymentCreatedEvent(data: { payment: PaymentEventDto }): Promise<void> {
    await this.paymentService.createOrUpdateFromEventDto(data.payment);
    await this.checkoutMetricsService.updateMetricsFromCreatedPayment(data.payment);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.PaymentSubmitted,
  })
  public async onPaymentSubmittedEvent(data: { payment: PaymentEventDto }): Promise<void> {
    await this.checkoutMetricsService.updateMetricsFromSubmittedPayment(data.payment);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.PaymentUpdated,
  })
  public async onPaymentUpdatedEvent(data: { payment: PaymentEventDto }): Promise<void> {
    await this.paymentService.createOrUpdateFromEventDto(data.payment);
    await this.checkoutMetricsService.updateMetricsFromUpdatedPayment(data.payment);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.PaymentRemoved,
  })
  public async onPaymentRemovedEvent(data: { payment: PaymentEventDto }): Promise<void> {
    await this.paymentService.removeById(data.payment.uuid);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.PaymentMigrate,
  })
  public async onPaymentMigrateEvent(data: { payment: PaymentEventDto }): Promise<void> {
    await this.paymentService.createOrUpdateFromEventDto(data.payment);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.PaymentBlankMigrate,
  })
  public async onPaymentBlankMigrateEvent(data: { payment: PaymentEventDto }): Promise<void> {
    await this.paymentService.createOrUpdateFromEventDto(data.payment);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.TransactionsMigrate,
  })
  public async onTransactionsMigrateEvent(data: { payment: PaymentEventDto }): Promise<void> {
    await this.paymentService.createOrUpdateFromEventDto(data.payment);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: MessageBusEventsEnum.TransactionsPaymentExport,
  })
  public async onTransactionsPaymentsExportEvent(data: TransactionsPaymentExportDto): Promise<void> {
    await this.paymentService.updateCustomerData(data);
  }
}
