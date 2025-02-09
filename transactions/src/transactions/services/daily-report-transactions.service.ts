import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { ExchangeCalculator, ExchangeCalculatorFactory } from '../currency';
import { DailyReportCurrencyDto, DailyReportFilterDto, DailyReportPaymentOptionDto } from '../dto/report';
import { TransactionModel } from '../models';

@Injectable()
export class DailyReportTransactionsService {
  constructor(
    @InjectModel('Transaction') private readonly transactionsModel: Model<TransactionModel>,
    private readonly exchangeCalculatorFactory: ExchangeCalculatorFactory,
  ) { }

  public async getDailyReportCurrency(dailyReportFilterDto: DailyReportFilterDto): Promise<DailyReportCurrencyDto[]> {
    const result: DailyReportCurrencyDto[] = [];
    const todayDate: Date = moment(dailyReportFilterDto.beginDate).toDate();
    const calculator: ExchangeCalculator = this.exchangeCalculatorFactory.create();

    const todayByCurrency: any = await this.transactionsModel
      .aggregate([
        { $match: { created_at: { $gte: todayDate }} },
        {
          $group: {
            _id: '$currency',
            total: { $sum: '$total' },
          },
        },
    ]);

    for (const currentVal of todayByCurrency) {
      result.push({
        currency: currentVal._id,
        exchangeRate: await calculator.getCurrencyExchangeRate(currentVal._id),
        overallTotal: 0,
        paymentOption: [],
        todayTotal: currentVal.total,
      });
    }

    const beforeTodayByCurrency: any = await this.transactionsModel
      .aggregate([
        { $match: { created_at: { $lt: todayDate }}},
        {
          $group: {
            _id: '$currency',
            total: { $sum: '$total' },
          },
        },
      ]);

    for (const currentVal of beforeTodayByCurrency) {
      const currentIndex: number = result.findIndex(
        (value: DailyReportCurrencyDto) => value.currency === currentVal._id );
      if (currentIndex !== -1) {
        result[currentIndex].overallTotal = currentVal.total;
      } else {
        result.push({
          currency: currentVal._id,
          exchangeRate: await calculator.getCurrencyExchangeRate(currentVal._id),
          overallTotal: currentVal.total,
          paymentOption: [],
          todayTotal: 0,
        });
      }
    }

    return result;
  }

  public async getDailyReportPaymentOption(
    dailyReportFilterDto: DailyReportFilterDto,
    dailyReportCurrencyDto: DailyReportCurrencyDto[],
  ): Promise<void> {
    const todayDate: Date = moment(dailyReportFilterDto.beginDate).toDate();

    const todayByCurrency: any = await this.transactionsModel
      .aggregate([
        { $match: { created_at: { $gte: todayDate}}},
        {
          $group: {
            _id: { currency: '$currency', type: '$type' },
            total: { $sum: '$total' },
          },
        },
      ]);

    for (const currentVal of todayByCurrency) {
      const currentIndex: number = dailyReportCurrencyDto.findIndex(
        (value: DailyReportCurrencyDto) =>
        (value.currency === currentVal._id.currency),
      );

      if (currentIndex === -1) {
        continue;
      }

      dailyReportCurrencyDto[currentIndex].paymentOption.push({
        overallTotal: 0,
        paymentOption: currentVal._id.type,
        todayTotal: currentVal.total,
      });
    }

    const beforeTodayByCurrency: any = await this.transactionsModel
      .aggregate([
        { $match: { created_at: { $lt: todayDate }}},
        {
          $group: {
            _id: { currency: '$currency', type: '$type'},
            total: { $sum: '$total' },
          },
        },
      ]);

    for (const currentVal of beforeTodayByCurrency) {
      const currentIndex: number = dailyReportCurrencyDto.findIndex(
        (value: DailyReportCurrencyDto) => value.currency === currentVal._id.currency);

      if (currentIndex === -1) {
        continue;
      }

      const currentPaymentIndex: number = dailyReportCurrencyDto[currentIndex].paymentOption.findIndex(
        (value: DailyReportPaymentOptionDto) => value.paymentOption === currentVal._id.type);

      if (currentPaymentIndex !== -1) {
        dailyReportCurrencyDto[currentIndex].paymentOption[currentPaymentIndex].overallTotal = currentVal.total;
      } else {
        dailyReportCurrencyDto[currentIndex].paymentOption.push({
          overallTotal: currentVal.total,
          paymentOption: currentVal._id.type,
          todayTotal: 0,
        });
      }
    }
  }
}
