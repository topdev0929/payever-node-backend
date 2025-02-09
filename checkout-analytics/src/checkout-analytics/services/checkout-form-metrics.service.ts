import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CheckoutFormMetricsSchemaName } from '../schemas';
import { CheckoutFormMetricsModel } from '../models';
import { PaymentFlowEventDto } from '../dto/payment-flow-event';
import { Mutex } from '@pe/nest-kit';

@Injectable()
export class CheckoutFormMetricsService {
  constructor(
    @InjectModel(CheckoutFormMetricsSchemaName)
    protected readonly checkoutFormMetricsModel: Model<CheckoutFormMetricsModel>,
    protected readonly mutex: Mutex,
  ) { }

  public async createFormMetricsFromCreatedFlow(paymentFlowDto: PaymentFlowEventDto): Promise<void> {
    const existing: CheckoutFormMetricsModel = await this.findOneByFlowId(paymentFlowDto.id);
    if (!existing) {
      await this.createBaseMetricsEntry(paymentFlowDto);
    }
  }

  public async updateFormMetricsFromUpdatedFlow(paymentFlowDto: PaymentFlowEventDto): Promise<void> {
    const metricsEntry: CheckoutFormMetricsModel =
      await this.findOneByFlowIdAndPaymentMethod(paymentFlowDto.id, paymentFlowDto.payment_method);

    if (!metricsEntry) {
      const baseMetricsEntry: CheckoutFormMetricsModel =
        await this.findOneByFlowIdAndPaymentMethod(paymentFlowDto.id, null);

      if (!baseMetricsEntry) {
        await this.createBaseMetricsEntry(paymentFlowDto);
      } else {
        baseMetricsEntry.paymentMethod = paymentFlowDto.payment_method;
        await this.updateMetrics(baseMetricsEntry);
      }
    }
  }

  protected async updateMetrics(formMetricsEntry: CheckoutFormMetricsModel): Promise<void> {
    await this.checkoutFormMetricsModel.updateOne(
      { _id: formMetricsEntry.id },
      { $set: formMetricsEntry },
    );
  }

  protected async findOneByFlowIdAndPaymentMethod(
    paymentFlowId: string,
    paymentMethod: string,
  ): Promise<CheckoutFormMetricsModel> {
    return this.checkoutFormMetricsModel.findOne({ paymentFlowId, paymentMethod });
  }

  protected async findOneByFlowId(paymentFlowId: string): Promise<CheckoutFormMetricsModel> {
    return this.checkoutFormMetricsModel.findOne({ paymentFlowId });
  }

  protected async createBaseMetricsEntry(paymentFlowDto: PaymentFlowEventDto): Promise<CheckoutFormMetricsModel> {
    return this.mutex.lock(
      'checkout-form-analytics-metrics',
      paymentFlowDto.id,
      async () => this.checkoutFormMetricsModel.create({
        apiCallId: paymentFlowDto.api_call_create_id,
        businessId: paymentFlowDto.business_id,
        paymentFlowId: paymentFlowDto.id,
        paymentMethod: paymentFlowDto.payment_method,
      } as CheckoutFormMetricsModel),
    );
  }
}
