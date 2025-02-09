/* tslint:disable:object-literal-sort-keys */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CheckoutMetricsSchemaName } from '../../schemas';
import { CheckoutMetricsModel } from '../../models';
import { CustomMetricsEnum, PaymentMethodsEnum, PaymentTypesEnum } from '../../enums';
import { BrowserTransactionsCountDto, DeviceTransactionsCountDto } from '../../dto/volume-report';
import { plainToClass } from 'class-transformer';

@Injectable()
export class VolumeReportCheckoutMetricsRetriever {
  constructor(
    @InjectModel(CheckoutMetricsSchemaName)
    private readonly checkoutMetricsModel: Model<CheckoutMetricsModel>,
  ) { }

  public async countFlow(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod, paymentType);

    if (paymentType === PaymentTypesEnum.submit) {
      Object.assign(conditions, {
        $and: [
          { forceRedirect: { $ne: true } },
          { paymentFlowId: { $ne: null } },
          {
            paymentFlowId: {
              $regex: /^[0-9]+$/,
            },
          },
        ],
      });

    } else if (paymentType === PaymentTypesEnum.create) {
      Object.assign(conditions, {
        $and: [
          { paymentFlowId: { $ne: null } },
          {
            $or: [
              { forceRedirect: true },
              {
                paymentFlowId: {
                  $not: { $regex: /^[0-9]+$/ },
                },
              },
            ],
          },
        ],
      });
    }


    return this.checkoutMetricsModel.countDocuments(conditions);
  }

  public async countFlowWithExcludedBusinesses(
    dateFrom: Date,
    dateTo: Date,
    excludedBusinessIds: string[],
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, null, paymentMethod);

    if (paymentType === PaymentTypesEnum.submit) {
      Object.assign(conditions, {
        $and: [
          { forceRedirect: { $ne: true } },
          { paymentFlowId: { $ne: null } },
          {
            paymentFlowId: {
              $regex: /^[0-9]+$/,
            },
          },
        ],
      });

    } else if (paymentType === PaymentTypesEnum.create) {
      Object.assign(conditions, {
        $and: [
          { paymentFlowId: { $ne: null } },
          {
            $or: [
              { forceRedirect: true },
              {
                paymentFlowId: {
                  $not: { $regex: /^[0-9]+$/ },
                },
              },
            ],
          },
        ],
      });
    }

    Object.assign(conditions, { businessId: { $nin: excludedBusinessIds } });

    return this.checkoutMetricsModel.countDocuments(conditions);
  }

  public async countNewPayments(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<number> {
    if (paymentType === PaymentTypesEnum.submit) {
      return 0;
    }
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod, paymentType);

    Object.assign(conditions, { newPaymentId: { $ne: null } });

    if (this.isRateStepPassRequired(paymentMethod)) {
      Object.assign(conditions, { customMetrics: CustomMetricsEnum.RateStepPassed });
    }

    return this.checkoutMetricsModel.countDocuments(conditions);
  }

  public async countNewPaymentsWithExcludedBusinesses(
    dateFrom: Date,
    dateTo: Date,
    excludedBusinessIds: string[],
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<number> {
    if (paymentType === PaymentTypesEnum.submit) {
      return 0;
    }

    const conditions: object = this.createBaseConditions(dateFrom, dateTo, null, paymentMethod, paymentType);

    Object.assign(conditions, { newPaymentId: { $ne: null } });
    Object.assign(conditions, { businessId: { $nin: excludedBusinessIds } });

    return this.checkoutMetricsModel.countDocuments(conditions);
  }

  public async countSuccessPayments(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
    excludeDeclined: boolean = true,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod, paymentType);

    if (paymentType === PaymentTypesEnum.create) {
      Object.assign(conditions, { newPaymentId: { $ne: null } });
    }
    Object.assign(conditions, { successPaymentId: { $ne: null } });

    return this.countAggregateSuccessPayments(conditions, excludeDeclined);
  }

  public async countSuccessPaymentsWithExcludedBusinesses(
    dateFrom: Date,
    dateTo: Date,
    excludedBusinessIds: string[],
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
    excludeDeclined: boolean = true,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, null, paymentMethod, paymentType);

    if (paymentType === PaymentTypesEnum.create) {
      Object.assign(conditions, { newPaymentId: { $ne: null } });
    }
    Object.assign(conditions, { successPaymentId: { $ne: null } });
    Object.assign(conditions, { businessId: { $nin: excludedBusinessIds } });

    return this.countAggregateSuccessPayments(conditions, excludeDeclined);
  }

  public async countDeclinedPayments(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod, paymentType);

    if (paymentType === PaymentTypesEnum.create) {
      Object.assign(conditions, { newPaymentId: { $ne: null } });
    }
    Object.assign(conditions, { successPaymentId: { $ne: null } });

    return this.countAggregateFailedPayments(conditions, true);
  }

  public async countDeclinedPaymentsWithExcludedBusinesses(
    dateFrom: Date,
    dateTo: Date,
    excludedBusinessIds: string[],
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, null, paymentMethod, paymentType);

    if (paymentType === PaymentTypesEnum.create) {
      Object.assign(conditions, { newPaymentId: { $ne: null } });
    }
    Object.assign(conditions, { successPaymentId: { $ne: null } });
    Object.assign(conditions, { businessId: { $nin: excludedBusinessIds } });

    return this.countAggregateFailedPayments(conditions, true);
  }

  public async countFailedPayments(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod, paymentType);

    if (paymentType === PaymentTypesEnum.create) {
      Object.assign(conditions, { newPaymentId: { $ne: null } });
    }
    Object.assign(conditions, { successPaymentId: { $ne: null } });

    return this.countAggregateFailedPayments(conditions);
  }

  public async countFailedPaymentsWithExcludedBusinesses(
    dateFrom: Date,
    dateTo: Date,
    excludedBusinessIds: string[],
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, null, paymentMethod, paymentType);

    if (paymentType === PaymentTypesEnum.create) {
      Object.assign(conditions, { newPaymentId: { $ne: null } });
    }
    Object.assign(conditions, { successPaymentId: { $ne: null } });
    Object.assign(conditions, { businessId: { $nin: excludedBusinessIds } });

    return this.countAggregateFailedPayments(conditions);
  }

  public async countPaidPayments(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod, paymentType);

    Object.assign(conditions, { successPaymentId: { $ne: null } });

    return this.countAggregatePaidPayments(conditions);
  }

  public async countPaidPaymentsWithExcludedBusinesses(
    dateFrom: Date,
    dateTo: Date,
    excludedBusinessIds: string[],
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, null, paymentMethod, paymentType);

    Object.assign(conditions, { successPaymentId: { $ne: null } });
    Object.assign(conditions, { businessId: { $nin: excludedBusinessIds } });

    return this.countAggregatePaidPayments(conditions);
  }

  public async countCustomMetricTriggers(
    customMetric: CustomMetricsEnum,
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    excludedBusinessIds: string[] = [],
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod, paymentType);

    Object.assign(conditions, { customMetrics: customMetric });
    if (excludedBusinessIds.length) {
      Object.assign(conditions, { businessId: { $nin: excludedBusinessIds } });
    }

    return this.checkoutMetricsModel.countDocuments(conditions);
  }

  public async getBrowserPaymentsEntries(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
  ): Promise<BrowserTransactionsCountDto[]> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod);

    Object.assign(conditions, { successPaymentId: { $ne: null }, browser: { $ne: null } });

    return this.getBrowserTransactionsCountEntries(conditions);
  }

  public async getDevicePaymentsEntries(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
  ): Promise<DeviceTransactionsCountDto[]> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo, businessId, paymentMethod);

    Object.assign(conditions, { successPaymentId: { $ne: null }, device: { $ne: null } });

    return this.getDeviceTransactionsCountEntries(conditions);
  }

  private createBaseConditions(
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
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

    if (paymentType === PaymentTypesEnum.submit) {
      Object.assign(conditions, {
        forceRedirect: { $ne: true },
        paymentFlowId: {
          $regex: /^[0-9]+$/,
        },
      });
    } else if (paymentType === PaymentTypesEnum.create) {
      Object.assign(conditions, {
        $or: [
          { forceRedirect: true },
          {
            paymentFlowId: {
              $not: { $regex: /^[0-9]+$/ },
            },
          },
        ],
      });
    }

    return conditions;
  }

  private async countAggregateSuccessPayments(conditions: object, excludeDeclined: boolean = true): Promise<number> {
    const excludedStatuses: string[] = ['STATUS_FAILED'];
    if (excludeDeclined) {
      excludedStatuses.push('STATUS_DECLINED');
    }

    const aggregateResult: any[] = await this.checkoutMetricsModel.aggregate([
      {
        $lookup: {
          from: 'payments',
          localField: 'newPaymentId',
          foreignField: 'originalId',
          as: 'payments',
        },
      },
      {
        $match: {
          ...conditions,
          'payments.0.status': { $nin: excludedStatuses },
        },
      },
      {
        $count: 'count',
      },
    ]);

    return aggregateResult[0]?.count ? aggregateResult[0].count : 0;
  }

  private async countAggregateFailedPayments(conditions: object, isDeclined: boolean = false): Promise<number> {
    const aggregateResult: any[] = await this.checkoutMetricsModel.aggregate([
      {
        $lookup: {
          from: 'payments',
          localField: 'newPaymentId',
          foreignField: 'originalId',
          as: 'payments',
        },
      },
      {
        $match: {
          ...conditions,
          'payments.0.status': isDeclined ? 'STATUS_DECLINED' : 'STATUS_FAILED',
        },
      },
      {
        $count: 'count',
      },
    ]);

    return aggregateResult[0]?.count ? aggregateResult[0].count : 0;
  }

  private async countAggregatePaidPayments(conditions: object): Promise<number> {
    const aggregateResult: any[] = await this.checkoutMetricsModel.aggregate([
      {
        $lookup: {
          from: 'payments',
          localField: 'newPaymentId',
          foreignField: 'originalId',
          as: 'payments',
        },
      },
      {
        $match: {
          ...conditions,
          'payments.0.status': 'STATUS_PAID',
        },
      },
      {
        $count: 'count',
      },
    ]);

    return aggregateResult[0]?.count ? aggregateResult[0].count : 0;
  }

  private async getBrowserTransactionsCountEntries(conditions: object): Promise<BrowserTransactionsCountDto[]> {
    const aggregateResult: any[] = await this.checkoutMetricsModel.aggregate([
      {
        $match: {
          ...conditions,
        },
      },
      {
        $group: {
          _id : '$browser',
          browser: { $first: '$browser' },
          transactionsCount: { $sum: 1 },
        },
      },
      {
        $sort : { transactionsCount: -1 },
      },
    ]);

    return plainToClass<BrowserTransactionsCountDto, []>(BrowserTransactionsCountDto, aggregateResult);
  }

  private async getDeviceTransactionsCountEntries(conditions: object): Promise<DeviceTransactionsCountDto[]> {
    const aggregateResult: any[] = await this.checkoutMetricsModel.aggregate([
      {
        $match: {
          ...conditions,
        },
      },
      {
        $group: {
          _id : '$device',
          device: { $first: '$device' },
          transactionsCount: { $sum: 1 },
        },
      },
      {
        $sort : { transactionsCount: -1 },
      },
    ]);

    return plainToClass<DeviceTransactionsCountDto, []>(DeviceTransactionsCountDto, aggregateResult);
  }

  private isRateStepPassRequired(paymentMethod: string): boolean {
    const allowedPaymentMethods: string[] = [
      PaymentMethodsEnum.santanderDeInstallment,
      PaymentMethodsEnum.santanderNoInstallment,
      PaymentMethodsEnum.santanderDkInstallment,
      PaymentMethodsEnum.santanderSeInstallment,
      PaymentMethodsEnum.santanderUKInstallment,
      PaymentMethodsEnum.santanderDeFactoring,
    ];

    return allowedPaymentMethods.includes(paymentMethod);
  }

  public isSubmitSupported(paymentMethod: string): boolean {
    const submitAllowedPayments: string[] = [
      PaymentMethodsEnum.santanderDeInvoice,
      PaymentMethodsEnum.santanderDePosInvoice,
      PaymentMethodsEnum.santanderDeFactoring,
      PaymentMethodsEnum.santanderDePosFactoring,
      PaymentMethodsEnum.cash,
      PaymentMethodsEnum.sofort,
      PaymentMethodsEnum.paypal,
      PaymentMethodsEnum.santanderNlInstallment,
      PaymentMethodsEnum.santanderAtInstallment,
      PaymentMethodsEnum.santanderFIInstallment,
      PaymentMethodsEnum.santanderFIPosInstallment,
      PaymentMethodsEnum.ziniaBnpl,
      PaymentMethodsEnum.ziniaPos,
      PaymentMethodsEnum.ziniaSliceThree,
      PaymentMethodsEnum.ziniaInstallment,
      PaymentMethodsEnum.ziniaBnplDe,
      PaymentMethodsEnum.ziniaPosDe,
      PaymentMethodsEnum.ziniaSliceThreeDe,
      PaymentMethodsEnum.ziniaInstallmentDe,
    ];

    return submitAllowedPayments.includes(paymentMethod);
  }
}
