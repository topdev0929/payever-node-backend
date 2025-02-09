/* eslint-disable @typescript-eslint/tslint/config */
/* tslint:disable:object-literal-sort-keys */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentSchemaName } from '../../schemas';
import { PaymentModel } from '../../models';
import {
  AllowedPaymentMethodsForCharts,
  PaymentMethodsEnum,
  PaymentStatusesEnum,
  TransactionStatusesEnum,
} from '../../enums';
import { MERCHANTS_LIMIT } from '../../constants';
import { ChartsTotalVolumeDto, TopMerchantTransactionsCountDto } from '../../dto/volume-report';
import { plainToClass } from 'class-transformer';
import { AggregateTransactionsQueryDto, AggregatedTransactionsResultDto } from '../../dto/payment';

@Injectable()
export class VolumeReportTransactionsRetriever {
  constructor(
    @InjectModel(PaymentSchemaName)
    private readonly paymentModel: Model<PaymentModel>,
  ) { }

  public async findAggregatedTransactions(
    aggregateQueryDto: AggregateTransactionsQueryDto,
  ): Promise<AggregatedTransactionsResultDto[]> {
    let baseConditions: { } = this.createVolumeReportBaseQueryConditions(
      aggregateQueryDto.dateFrom,
      aggregateQueryDto.dateTo,
      aggregateQueryDto.paymentMethod,
      aggregateQueryDto.considerUpdatedTransactions,
    );

    if (aggregateQueryDto.businessId) {
      baseConditions = {
        ...baseConditions,
        businessId: aggregateQueryDto.businessId,
      };
    }

    if (aggregateQueryDto.excludedBusinessIds && aggregateQueryDto.excludedBusinessIds.length) {
      baseConditions = {
        ...baseConditions,
        businessId: { $nin: aggregateQueryDto.excludedBusinessIds },
      };
    }

    if (aggregateQueryDto.channel) {
      baseConditions = {
        ...baseConditions,
        channel: aggregateQueryDto.channel,
      };
    }

    return this.paymentModel.aggregate([
      {
        $match: {
          ...baseConditions,
          status: this.getStatusCondition(aggregateQueryDto.status),
        },
      },
      {
        $group: {
          _id: '$currency',
          paymentMethod: { $first: '$paymentMethod' },
          count: { $sum: 1 },
          total: { $sum: '$total' },
          businesses: { $addToSet: '$businessId' },
        },
      },
      {
        $project: {
          _id: 0,
          paymentMethod: '$paymentMethod',
          currency: '$_id',
          count: '$count',
          total: '$total',
          businesses: '$businesses',
        },
      },
    ]);
  }

  public async findTopMerchants(
    dateFrom: Date,
    dateTo: Date,
    paymentMethod: PaymentMethodsEnum = null,
    considerUpdatedTransactions: boolean = false,
  ): Promise<TopMerchantTransactionsCountDto[]> {
    const baseConditions: { } =
      this.createVolumeReportBaseQueryConditions(dateFrom, dateTo, paymentMethod, considerUpdatedTransactions);

    const topMerchants: any[] = await this.paymentModel.aggregate([
      {
        $match: baseConditions,
      },
      {
        $group: {
          _id : '$businessId',
          companyName: { $first: '$businessName' },
          transactionsCount: { $sum: 1 },
          uuid: { $first: '$businessId' },
        },
      },
      {
        $sort : { transactionsCount: -1 },
      },
    ]).limit(MERCHANTS_LIMIT);

    return plainToClass<TopMerchantTransactionsCountDto, []>(TopMerchantTransactionsCountDto, topMerchants);
  }

  public async getTotalVolume(
    dateFrom: Date,
    dateTo: Date,
    paymentMethod: PaymentMethodsEnum,
  ): Promise<ChartsTotalVolumeDto[]> {
    if (!AllowedPaymentMethodsForCharts.includes(paymentMethod)) {
      return [];
    }

    const baseConditions: { } = {
      updatedAt: { $gte: dateFrom, $lte: dateTo },
      paymentMethod,
    };

    return this.paymentModel.aggregate([
      {
        $match: baseConditions,
      },
      {
        $group: {
          _id: { $month: '$updatedAt' },
          total: { $sum: '$total' },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          total: '$total',
        },
      },
      {
        $sort : { month: 1 },
      },
    ]);
  }

  public async getApprovedTotalVolume(
    dateFrom: Date,
    dateTo: Date,
    paymentMethod: PaymentMethodsEnum,
  ): Promise<ChartsTotalVolumeDto[]> {
    if (!AllowedPaymentMethodsForCharts.includes(paymentMethod)) {
      return [];
    }

    const baseConditions: { } = {
      updatedAt: { $gte: dateFrom, $lte: dateTo },
      paymentMethod,
      status: { $in: [ PaymentStatusesEnum.statusAccepted, PaymentStatusesEnum.statusPaid ] },
    };

    return this.paymentModel.aggregate([
      {
        $match: baseConditions,
      },
      {
        $group: {
          _id: { $month: '$updatedAt' },
          total: { $sum: '$total' },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          total: '$total',
        },
      },
      {
        $sort : { month: 1 },
      },
    ]);
  }

  private createVolumeReportBaseQueryConditions(
    dateFrom: Date,
    dateTo: Date,
    paymentMethod: PaymentMethodsEnum = null,
    considerUpdatedTransactions: boolean = false,
  ): { } {
    const conditions: any = { };

    if (considerUpdatedTransactions) {
      conditions.updatedAt = { $gte: dateFrom, $lte: dateTo };
    } else {
      conditions.createdAt = { $gte: dateFrom, $lte: dateTo };
    }

    conditions.paymentMethod = paymentMethod ? paymentMethod : { $in: Object.values(PaymentMethodsEnum) };

    return conditions;
  }

  private getStatusCondition(status: TransactionStatusesEnum) {
    switch (status) {
      case TransactionStatusesEnum.approved:
        return { $in: [PaymentStatusesEnum.statusAccepted, PaymentStatusesEnum.statusPaid] };
      case TransactionStatusesEnum.rejected:
        return {
          $nin: [PaymentStatusesEnum.statusAccepted,
          PaymentStatusesEnum.statusPaid,
          PaymentStatusesEnum.statusInProcess,
          ],
        };

      case TransactionStatusesEnum.inProcess:
        return {
          $in: [
            PaymentStatusesEnum.statusInProcess,
          ],
        };

      default:
        return {};
    }
  }

}
