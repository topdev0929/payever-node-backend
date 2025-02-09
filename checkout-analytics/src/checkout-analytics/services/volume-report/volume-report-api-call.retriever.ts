/* tslint:disable:object-literal-sort-keys */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActionApiCallSchemaName, ApiCallSchemaName } from '../../schemas';
import { ActionApiCallModel, ApiCallModel } from '../../models';
import { PaymentMethodsEnum } from '../../enums';

@Injectable()
export class VolumeReportApiCallRetriever {
  constructor(
    @InjectModel(ApiCallSchemaName) private readonly apiCallModel: Model<ApiCallModel>,
    @InjectModel(ActionApiCallSchemaName) private readonly actionApiCallModel: Model<ActionApiCallModel>,
  ) { }

  public async getPaymentCreateAvgResponseTime(
    dateFrom: Date,
    dateTo: Date,
    paymentMethods: PaymentMethodsEnum[] = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo);

    if (paymentMethods && paymentMethods.length) {
      Object.assign(conditions, { paymentMethod: { $in: paymentMethods }});
    }

    const result: any[] = await this.apiCallModel.aggregate([
      {
        $match: conditions,
      },
      {
        $group: {
          '_id': null,
          'avg': { '$avg': '$executionTime' },
        },
      },
    ]);

    return result[0]?.avg ? result[0].avg : 0;
  }

  public async getActionAvgResponseTime(
    dateFrom: Date,
    dateTo: Date,
    actions: string[],
    paymentMethods: PaymentMethodsEnum[] = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo);

    if (paymentMethods && paymentMethods.length) {
      Object.assign(conditions, { 'payments.0.paymentMethod': { $in: paymentMethods }});
    }

    Object.assign(conditions, { action: { $in: actions}});

    return this.getActionsAvgResponseTime(conditions);
  }

  private createBaseConditions(
    dateFrom: Date,
    dateTo: Date,
  ): object {
    return {
      createdAt: { $gte: dateFrom, $lte: dateTo },
      executionTime: { $ne: null },
    };
  }

  private async getActionsAvgResponseTime(conditions: object): Promise<number> {
    const result: any[] = await this.actionApiCallModel.aggregate([
      {
        $lookup: {
          from: 'payments',
          localField: 'paymentId',
          foreignField: 'originalId',
          as: 'payments',
        },
      },
      {
        $match: conditions,
      },
      {
        $group: {
          '_id': null,
          'avg': { '$avg': '$executionTime' },
        },
      },
    ]);

    return result[0]?.avg ? result[0].avg : 0;
  }
}
