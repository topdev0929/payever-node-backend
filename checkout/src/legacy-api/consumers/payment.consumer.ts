import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitBinding, MessageBusChannelsEnum } from '../../environments';
import { CreatePaymentDto } from '../dto/payment-event';
import { PaymentInterface } from '../interfaces';
import { PaymentService } from '../services';
import { FlowService } from '../../flow';
import { PaymentLinkService } from '../../payment-links/services/payment-link.service';

@Controller()
export class PaymentConsumer {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly flowService: FlowService,
    private readonly paymentLinkService: PaymentLinkService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.PaymentMigrate,
  })
  public async onPaymentMigrateEvent(data: { payment: CreatePaymentDto }): Promise<void> {
    await this.processInitialPayment(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.PaymentCreated,
  })
  public async onPaymentCreatedEvent(data: { payment: CreatePaymentDto }): Promise<void> {
    await this.processInitialPayment(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.PaymentSubmmited,
  })
  public async onPaymentSubmitedEvent(data: { payment: CreatePaymentDto }): Promise<void> {
    await this.paymentLinkService.updatePaymentAndStatusByApiCallId(data.payment.api_call_id, data.payment.id);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.PaymentUpdated,
  })
  public async onPaymentUpdatedEvent(data: { payment: CreatePaymentDto }): Promise<void> {
    await this.createOrUpdatePayment(data.payment);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.PaymentRemoved,
  })
  public async onPaymentRemovedEvent(data: { payment: CreatePaymentDto }): Promise<void> {
    await this.paymentService.removeByUuid(data.payment.uuid);
  }

  private async createOrUpdatePayment(createPaymentDto: CreatePaymentDto): Promise<void> {
    const payment: PaymentInterface = PaymentService.paymentDtoToModel(createPaymentDto);

    await this.paymentService.createOrUpdate(payment);
  }

  private async processInitialPayment(data: { payment: CreatePaymentDto }): Promise<void> {
    await this.createOrUpdatePayment(data.payment);
    await this.flowService.applyPaymentId(data.payment.payment_flow.id, data.payment.id);
  }
}
