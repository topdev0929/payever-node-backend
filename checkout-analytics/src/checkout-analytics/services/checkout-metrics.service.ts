import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CheckoutMetricsSchemaName } from '../schemas';
import { CheckoutMetricsModel } from '../models';
import { PaymentFlowEventDto } from '../dto/payment-flow-event';
import { Mutex } from '@pe/nest-kit';
import { PaymentEventDto } from '../dto/';
import { DIRECT_SUBMIT_FLOW_ID } from '../constants';
import { v4 as uuid } from 'uuid';
import { PaymentMethodsEnum } from '../enums';

@Injectable()
export class CheckoutMetricsService {
  constructor(
    @InjectModel(CheckoutMetricsSchemaName) private readonly checkoutMetricsModel: Model<CheckoutMetricsModel>,
    private readonly mutex: Mutex,
  ) { }

  public async createMetricsFromCreatedFlow(paymentFlowDto: PaymentFlowEventDto): Promise<void> {
    const existing: CheckoutMetricsModel = await this.findOneByFlowId(paymentFlowDto.id);
    if (!existing) {
      await this.createBaseMetricsEntry(paymentFlowDto);
    }
  }

  public async updateMetricsFromUpdatedFlow(paymentFlowDto: PaymentFlowEventDto): Promise<void> {
    const metricsEntry: CheckoutMetricsModel =
      await this.findOneByFlowIdAndPaymentMethod(paymentFlowDto.id, paymentFlowDto.payment_method);

    if (!metricsEntry) {
      const baseMetricsEntry: CheckoutMetricsModel =
        await this.findOneByFlowIdAndPaymentMethod(paymentFlowDto.id, null);

      if (!baseMetricsEntry) {
        await this.createBaseMetricsEntry(paymentFlowDto);
      } else {
        baseMetricsEntry.paymentMethod = paymentFlowDto.payment_method;
        await this.updateMetrics(baseMetricsEntry);
      }
    }
  }

  public async updateMetricsFromCreatedPayment(paymentDto: PaymentEventDto): Promise<void> {
    const paymentFlowDto: PaymentFlowEventDto = paymentDto?.payment_flow;
    if (!paymentDto || !paymentFlowDto || !paymentFlowDto?.id) {
      return;
    }

    if (this.shouldBeIgnored(paymentDto)) {
      return;
    }

    if (paymentFlowDto.id === DIRECT_SUBMIT_FLOW_ID) {
      paymentFlowDto.id = CheckoutMetricsService.generateSubmitFlowId(paymentDto.id);
    }

    let metricsEntry: CheckoutMetricsModel =
      await this.findOneByFlowIdAndPaymentMethod(paymentFlowDto.id, paymentDto.payment_type);

    if (!metricsEntry) {
      metricsEntry = await this.createSubmitMetricsEntry(paymentDto);
    }

    metricsEntry.newPaymentId = paymentDto.id;
    await this.updateMetrics(metricsEntry);
  }

  public async updateMetricsFromUpdatedPayment(paymentDto: PaymentEventDto): Promise<void> {
    if (!this.shouldBeUpdated(paymentDto)) {
      return;
    }
    await this.updateMetricsFromCreatedPayment(paymentDto);
  }

  public async updateMetricsFromSubmittedPayment(paymentDto: PaymentEventDto): Promise<void> {
    const paymentFlowDto: PaymentFlowEventDto = paymentDto?.payment_flow;
    if (!paymentDto || !paymentFlowDto || !paymentFlowDto?.id) {
      return;
    }

    if (this.shouldBeIgnored(paymentDto)) {
      return;
    }

    if (paymentFlowDto.id === DIRECT_SUBMIT_FLOW_ID) {
      paymentFlowDto.id = CheckoutMetricsService.generateSubmitFlowId(paymentDto.id);
    }

    let metricsEntry: CheckoutMetricsModel =
      await this.findOneByFlowIdAndPaymentMethod(paymentFlowDto.id, paymentDto.payment_type);

    if (!metricsEntry) {
      metricsEntry = await this.createSubmitMetricsEntry(paymentDto);
    }

    metricsEntry.successPaymentId = paymentDto.id;
    await this.updateMetrics(metricsEntry);
  }

  private shouldBeIgnored(paymentDto: PaymentEventDto): boolean {
    if (this.isSantanderNoPayment(paymentDto)) {
      const shouldBeIgnoredForSantanderNo: string[] = [
        null,
        'NEED_MORE_INFO_IIR',
        'NEED_MORE_INFO_STUDENT_IIR',
        'NEED_MORE_INFO_DTI',
        'NEED_MORE_INFO_SIFO',
        'NEED_MORE_INFO_STUDENT_SIFO',
        'NEED_MORE_INFO',
      ];

      return shouldBeIgnoredForSantanderNo.includes(paymentDto.specific_status);
    }

    return false;
  }

  private shouldBeUpdated(paymentDto: PaymentEventDto): boolean {
    if (this.isSantanderNoPayment(paymentDto)) {
      return paymentDto.specific_status === 'APPROVED';
    }

    return false;
  }

  private isSantanderNoPayment(paymentDto: PaymentEventDto): boolean {
    const NOPaymentMethods: string[] = [
      PaymentMethodsEnum.santanderNoInstallment,
      PaymentMethodsEnum.santanderNoPosInstallment,
    ];

    return NOPaymentMethods.includes(paymentDto.payment_type);
  }

  private async findOneByFlowId(paymentFlowId: string): Promise<CheckoutMetricsModel> {
    return this.checkoutMetricsModel.findOne({ paymentFlowId });
  }

  private async findOneByFlowIdAndPaymentMethod(
    paymentFlowId: string,
    paymentMethod: string,
  ): Promise<CheckoutMetricsModel> {
    return this.checkoutMetricsModel.findOne({ paymentFlowId, paymentMethod });
  }

  private async updateMetrics(metricsEntry: CheckoutMetricsModel): Promise<void> {
    await this.checkoutMetricsModel.updateOne(
      { _id: metricsEntry.id },
      { $set: metricsEntry },
    );
  }

  private async createBaseMetricsEntry(paymentFlowDto: PaymentFlowEventDto): Promise<CheckoutMetricsModel> {
    return this.mutex.lock(
      'checkout-analytics-metrics',
      paymentFlowDto.id,
      async () => this.checkoutMetricsModel.create({
        apiCallId: paymentFlowDto.api_call_create_id,
        businessId: paymentFlowDto.business_id,
        paymentFlowId: paymentFlowDto.id,
        paymentMethod: paymentFlowDto.payment_method,
      } as CheckoutMetricsModel),
    );
  }

  private async createSubmitMetricsEntry(paymentDto: PaymentEventDto): Promise<CheckoutMetricsModel> {
    return this.mutex.lock(
      'checkout-analytics-metrics',
      paymentDto.payment_flow.id,
      async () => this.checkoutMetricsModel.findOneAndUpdate(
        {
          paymentFlowId: paymentDto.payment_flow.id,
          paymentMethod: paymentDto.payment_type,
        },
        {
          $set: {
            apiCallId: paymentDto.api_call_id,
            businessId: paymentDto.business.uuid,
            forceRedirect: paymentDto.force_redirect,
            newPaymentId: paymentDto.id,
            paymentFlowId: paymentDto.payment_flow.id,
            paymentMethod: paymentDto.payment_type,
          },
          $setOnInsert: {
            _id: uuid(),
          },
        },
        { new: true, upsert: true },
      ),
    );
  }

  /* tslint:disable:no-bitwise */
  private static generateSubmitFlowId(paymentId: string): string {
    let tmpHash1: number = 0xdeadbeef;
    let tmpHash2: number = 0x41c6ce57;
    let charCode: number;

    for (let i: number = 0; i < paymentId.length; i++) {
      charCode = paymentId.charCodeAt(i);
      tmpHash1 = Math.imul(tmpHash1 ^ charCode, 2654435761);
      tmpHash2 = Math.imul(tmpHash2 ^ charCode, 1597334677);
    }
    tmpHash1 =
      Math.imul(tmpHash1 ^ (tmpHash1 >>> 16), 2246822507) ^ Math.imul(tmpHash2 ^ (tmpHash2 >>> 13), 3266489909);
    tmpHash2 =
      Math.imul(tmpHash2 ^ (tmpHash2 >>> 16), 2246822507) ^ Math.imul(tmpHash1 ^ (tmpHash1 >>> 13), 3266489909);

    return (4294967296 * (2097151 & tmpHash2) + (tmpHash1 >>> 0)).toString(10);
  }
}
