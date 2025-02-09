/* tslint:disable:object-literal-sort-keys */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CheckoutFormMetricsSchemaName } from '../../schemas';
import { CheckoutMetricsModel } from '../../models';
import { PaymentMethodsEnum } from '../../enums';

@Injectable()
export class VolumeReportCheckoutFormMetricsRetriever {
  constructor(
    @InjectModel(CheckoutFormMetricsSchemaName)
      private readonly checkoutFormMetricsModel: Model<CheckoutMetricsModel>,
  ) { }

  public async allForms(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
  ): Promise<any[]> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod);

    Object.assign(conditions, { paymentFlowId: { $ne: null } });

    return this.checkoutFormMetricsModel.aggregate([
      {
        $match: conditions,
      },
      { $unwind: '$forms' },
      { $replaceRoot: { newRoot: '$forms' }},
      { $match: { status: 'closed' }},
      {
        $group: { _id: '$name', count: { $sum: 1 }},
      },
    ]);
  }

  public async allFields(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
  ): Promise<any[]> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod);

    Object.assign(conditions, { paymentFlowId: { $ne: null } });

    return this.checkoutFormMetricsModel.aggregate([
      {
        $match: conditions,
      },
      { $unwind: '$formActions' },
      { $replaceRoot: { newRoot: '$formActions' }},
      { $match: { action: 'blur' }},
      {
        $group: { _id: '$field', count: { $sum: 1 }},
      },
    ]);
  }

  public async countAllForms(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod);

    Object.assign(conditions, { paymentFlowId: { $ne: null } });

    return this.checkoutFormMetricsModel.countDocuments(conditions);
  }

  public async countNotCompletedForms(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod);

    Object.assign(conditions, { paymentFlowId: { $ne: null } });
    Object.assign(conditions, { successPaymentId: null });

    return this.checkoutFormMetricsModel.countDocuments(conditions);
  }

  private createBaseConditions(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
  ): object {
    const conditions: object = {
      createdAt: { $gte: dateFrom, $lte: dateTo },
    };

    if (businessId) {
      Object.assign(conditions, { businessId: businessId });
    }

    if (paymentMethod) {
      Object.assign(conditions, { paymentMethod: paymentMethod });
    }

    return conditions;
  }
}
