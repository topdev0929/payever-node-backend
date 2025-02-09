import { Injectable } from '@nestjs/common';
import { VolumeReportTransactionsRetriever } from './volume-report-transactions.retriever';
import {
  ChannelsReportDto,
  ChannelTransactionsReportDto,
  CountryPaymentMethodReportDto,
  CountryReportDto,
  StateReportDto,
  TransactionsReportDto,
} from '../../dto/volume-report';
import {
  CountryPaymentMethods,
  PaymentMethodsEnum,
  ReportCountriesEnum,
  TransactionStatusesEnum,
} from '../../enums';
import { CurrencyExchangeService } from '../currency-exchange.service';
import { DateRangeService } from './date-range.service';
import { StatisticsCalculator } from './statistics.calculator';
import { SupportedChannelsEnum } from '../../enums/supported-channels.enum';
import { AggregatedTransactionsResultDto } from '../../dto/payment';

@Injectable()
export class VolumeChannelsReportManager {
  constructor(
    private readonly transactionsRetriever: VolumeReportTransactionsRetriever,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) { }

  public async prepareAggregatedChannelsReport(
    dateFrom: Date,
    dateTo: Date,
    country: ReportCountriesEnum,
  ): Promise<ChannelsReportDto> {
    const channelsReport: ChannelsReportDto = new ChannelsReportDto();
    channelsReport.reportDate = DateRangeService.getFormattedReportDateRange(dateFrom, dateTo);

    for (const channel of Object.values(SupportedChannelsEnum)) {
      const channelTransactionsReport: ChannelTransactionsReportDto = new ChannelTransactionsReportDto(channel);
      channelsReport.channelTransactionsReports.push(channelTransactionsReport);
      if (country) {
        await this.calculateAggregatedTransactionsCountAndVolumeByCountryAndChannel(
          CountryPaymentMethods.get(country),
          channelTransactionsReport,
          channelsReport,
          country,
          channel,
          dateFrom,
          dateTo,
        );
      } else {
        for (const countryPaymentMethods of CountryPaymentMethods) {
          await this.calculateAggregatedTransactionsCountAndVolumeByCountryAndChannel(
            countryPaymentMethods[1],
            channelTransactionsReport,
            channelsReport,
            countryPaymentMethods[0],
            channel,
            dateFrom,
            dateTo,
          );
        }
      }
      this.calculateOverallTransactionsStatistics(channelTransactionsReport);
    }

    this.calculateOverallChannelsStatistics(channelsReport);

    return channelsReport;
  }

  private async calculateAggregatedTransactionsCountAndVolumeByCountryAndChannel(
    paymentMethods: PaymentMethodsEnum[],
    transactionsReport: TransactionsReportDto,
    channelsReport: ChannelsReportDto,
    country: ReportCountriesEnum,
    channel: SupportedChannelsEnum,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<void> {
    const countryReport: CountryReportDto = new CountryReportDto(country);
    transactionsReport.countriesReports.push(countryReport);

    for (const paymentMethod of paymentMethods) {
      const paymentMethodReport: CountryPaymentMethodReportDto = new CountryPaymentMethodReportDto(paymentMethod);
      countryReport.paymentMethodsReports.push(paymentMethodReport);

      const approvedAggregatedResults: AggregatedTransactionsResultDto[] =
        await this.transactionsRetriever.findAggregatedTransactions({
          channel,
          considerUpdatedTransactions: true,
          dateFrom,
          dateTo,
          paymentMethod,
          status: TransactionStatusesEnum.approved,
        });
      await this.calculateAggregatedTransactionsCountAndVolume(
        approvedAggregatedResults,
        paymentMethodReport,
        countryReport,
        transactionsReport,
        channelsReport,
        TransactionStatusesEnum.approved
      );

      const inProcessAggregatedResults: AggregatedTransactionsResultDto[] =
        await this.transactionsRetriever.findAggregatedTransactions({
          channel,
          considerUpdatedTransactions: true,
          dateFrom,
          dateTo,
          paymentMethod,
          status: TransactionStatusesEnum.inProcess,
        });
      await this.calculateAggregatedTransactionsCountAndVolume(
        inProcessAggregatedResults,
        paymentMethodReport,
        countryReport,
        transactionsReport,
        channelsReport,
        TransactionStatusesEnum.inProcess,
      );

      const rejectedAggregatedResults: AggregatedTransactionsResultDto[] =
        await this.transactionsRetriever.findAggregatedTransactions({
          channel,
          considerUpdatedTransactions: true,
          dateFrom,
          dateTo,
          paymentMethod,
          status: TransactionStatusesEnum.rejected,
        });
      await this.calculateAggregatedTransactionsCountAndVolume(
        rejectedAggregatedResults,
        paymentMethodReport,
        countryReport,
        transactionsReport,
        channelsReport,
        TransactionStatusesEnum.rejected,
      );
    }
  }

  private async calculateAggregatedTransactionsCountAndVolume(
    aggregatedResults: AggregatedTransactionsResultDto[],
    paymentMethodReport: CountryPaymentMethodReportDto,
    countryReport: CountryReportDto,
    transactionsReport: TransactionsReportDto,
    channelsReport: ChannelsReportDto,
    transactionStatus: TransactionStatusesEnum = TransactionStatusesEnum.approved,
  ): Promise<void> {
    const paymentMethodStateReport: StateReportDto =
      transactionStatus === TransactionStatusesEnum.approved
        ? paymentMethodReport.approvedReport
        : transactionStatus === TransactionStatusesEnum.inProcess
          ? paymentMethodReport.inProcessReport
          : paymentMethodReport.rejectedReport;
    const countryStateReport: StateReportDto =
      transactionStatus === TransactionStatusesEnum.approved
        ? countryReport.approvedCountryReport
        : transactionStatus === TransactionStatusesEnum.inProcess
          ? countryReport.inProcessCountryReport
          : countryReport.rejectedCountryReport;
    const overallStateReport: StateReportDto =
      transactionStatus === TransactionStatusesEnum.approved
        ? transactionsReport.overallApprovedReport
        : transactionStatus === TransactionStatusesEnum.inProcess
          ? transactionsReport.overallInProcessReport
          : transactionsReport.overallRejectedReport;
    const channelsStateReport: StateReportDto =
      transactionStatus === TransactionStatusesEnum.approved ?
        channelsReport.overallApprovedReport
        : transactionStatus === TransactionStatusesEnum.inProcess
          ? channelsReport.overallInProcessReport
          : channelsReport.overallRejectedReport;

    for (const result of aggregatedResults) {
      paymentMethodReport.incrementTransactionsCount(result.count);
      paymentMethodStateReport.incrementTransactionsCount(result.count);
      countryReport.incrementTransactionsCount(result.count);
      countryStateReport.incrementTransactionsCount(result.count);
      transactionsReport.incrementTransactionsCount(result.count);
      overallStateReport.incrementTransactionsCount(result.count);
      channelsReport.incrementTransactionsCount(result.count);
      channelsStateReport.incrementTransactionsCount(result.count);

      const total: number =
        await this.currencyExchangeService.exchangeVolumeTotal(result.total, result.currency?.toUpperCase());
      paymentMethodReport.incrementVolumeTotal(total);
      paymentMethodStateReport.incrementVolumeTotal(total);
      countryReport.incrementVolumeTotal(total);
      countryStateReport.incrementVolumeTotal(total);
      transactionsReport.incrementVolumeTotal(total);
      overallStateReport.incrementVolumeTotal(total);
      channelsReport.incrementVolumeTotal(total);
      channelsStateReport.incrementVolumeTotal(total);

      if (result.businesses && result.businesses.length) {
        for (const businessId of result.businesses) {
          StatisticsCalculator.addStateReportActiveMerchant(paymentMethodReport, businessId);
          StatisticsCalculator.addStateReportActiveMerchant(countryReport, businessId);
          StatisticsCalculator.addStateReportActiveMerchant(transactionsReport, businessId);
        }
      }
    }
  }

  private calculateOverallTransactionsStatistics(
    transactionsReport: TransactionsReportDto,
  ): void {
    for (const countryReport of transactionsReport.countriesReports) {
      StatisticsCalculator.calculateReportStatistics(countryReport.approvedCountryReport, countryReport);
      StatisticsCalculator.calculateReportStatistics(countryReport.inProcessCountryReport, countryReport);
      StatisticsCalculator.calculateReportStatistics(countryReport.rejectedCountryReport, countryReport);
      StatisticsCalculator.calculateReportStatistics(countryReport, transactionsReport);

      for (const paymentMethodReport of countryReport.paymentMethodsReports) {
        StatisticsCalculator.calculateReportStatistics(paymentMethodReport.approvedReport, paymentMethodReport);
        StatisticsCalculator.calculateReportStatistics(paymentMethodReport.inProcessReport, paymentMethodReport);
        StatisticsCalculator.calculateReportStatistics(paymentMethodReport.rejectedReport, paymentMethodReport);
        StatisticsCalculator.calculateReportStatistics(paymentMethodReport, transactionsReport);
      }
    }

    StatisticsCalculator.calculateReportStatistics(transactionsReport.overallApprovedReport, transactionsReport);
    StatisticsCalculator.calculateReportStatistics(transactionsReport.overallInProcessReport, transactionsReport);
    StatisticsCalculator.calculateReportStatistics(transactionsReport.overallRejectedReport, transactionsReport);
    StatisticsCalculator.calculateReportStatistics(transactionsReport, transactionsReport);
  }

  private calculateOverallChannelsStatistics(
    channelsReport: ChannelsReportDto,
  ): void {
    for (const transactionsReport of channelsReport.channelTransactionsReports) {
      StatisticsCalculator.calculateReportStatistics(transactionsReport.overallApprovedReport, channelsReport);
      StatisticsCalculator.calculateReportStatistics(transactionsReport.overallInProcessReport, channelsReport);
      StatisticsCalculator.calculateReportStatistics(transactionsReport.overallRejectedReport, channelsReport);
      StatisticsCalculator.calculateReportStatistics(transactionsReport, channelsReport);
    }
  }
}
