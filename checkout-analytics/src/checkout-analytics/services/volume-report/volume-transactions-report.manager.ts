import { Injectable } from '@nestjs/common';
import { VolumeReportTransactionsRetriever } from './volume-report-transactions.retriever';
import {
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
import { AggregatedTransactionsResultDto } from '../../dto/payment';

@Injectable()
export class VolumeTransactionsReportManager {
  constructor(
    private readonly transactionsRetriever: VolumeReportTransactionsRetriever,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) { }

  public async prepareAggregatedTransactionsReport(
    dateFrom: Date,
    dateTo: Date,
    country: ReportCountriesEnum,
  ): Promise<TransactionsReportDto> {
    const transactionsReport: TransactionsReportDto = new TransactionsReportDto();
    transactionsReport.reportDate = DateRangeService.getFormattedReportDateRange(dateFrom, dateTo);
    if (country) {
      await this.calculateAggregatedTransactionsCountAndVolumeByCountry(
        CountryPaymentMethods.get(country),
        transactionsReport,
        country,
        dateFrom,
        dateTo,
      );
    } else {
      for (const countryPaymentMethods of CountryPaymentMethods) {
        await this.calculateAggregatedTransactionsCountAndVolumeByCountry(
          countryPaymentMethods[1],
          transactionsReport,
          countryPaymentMethods[0],
          dateFrom,
          dateTo,
        );
      }
    }
    this.calculateOverallTransactionsStatistics(transactionsReport);

    return transactionsReport;
  }

  private async calculateAggregatedTransactionsCountAndVolumeByCountry(
    paymentMethods: PaymentMethodsEnum[],
    transactionsReport: TransactionsReportDto,
    country: ReportCountriesEnum,
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
          considerUpdatedTransactions: true,
          dateFrom,
          dateTo,
          paymentMethod,
          status: TransactionStatusesEnum.approved,
        });
      await this.calculateAggregatedCountAndVolume(
        approvedAggregatedResults,
        paymentMethodReport,
        countryReport,
        transactionsReport,
        TransactionStatusesEnum.approved
      );

      const inProcessAggregatedResults: AggregatedTransactionsResultDto[] =
        await this.transactionsRetriever.findAggregatedTransactions({
          considerUpdatedTransactions: true,
          dateFrom,
          dateTo,
          paymentMethod,
          status: TransactionStatusesEnum.inProcess,
        });
      await this.calculateAggregatedCountAndVolume(
        inProcessAggregatedResults,
        paymentMethodReport,
        countryReport,
        transactionsReport,
        TransactionStatusesEnum.inProcess,
      );

      const rejectedAggregatedResults: AggregatedTransactionsResultDto[] =
        await this.transactionsRetriever.findAggregatedTransactions({
          considerUpdatedTransactions: true,
          dateFrom,
          dateTo,
          paymentMethod,
          status: TransactionStatusesEnum.rejected,
        });
      await this.calculateAggregatedCountAndVolume(
        rejectedAggregatedResults,
        paymentMethodReport,
        countryReport,
        transactionsReport,
        TransactionStatusesEnum.rejected,
      );
    }
  }

  private async calculateAggregatedCountAndVolume(
    aggregatedResults: AggregatedTransactionsResultDto[],
    paymentMethodReport: CountryPaymentMethodReportDto,
    countryReport: CountryReportDto,
    transactionsReport: TransactionsReportDto,
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

    for (const result of aggregatedResults) {
      paymentMethodReport.incrementTransactionsCount(result.count);
      paymentMethodStateReport.incrementTransactionsCount(result.count);
      countryReport.incrementTransactionsCount(result.count);
      countryStateReport.incrementTransactionsCount(result.count);
      transactionsReport.incrementTransactionsCount(result.count);
      overallStateReport.incrementTransactionsCount(result.count);

      const total: number =
        await this.currencyExchangeService.exchangeVolumeTotal(result.total, result.currency?.toUpperCase());
      paymentMethodReport.incrementVolumeTotal(total);
      paymentMethodStateReport.incrementVolumeTotal(total);
      countryReport.incrementVolumeTotal(total);
      countryStateReport.incrementVolumeTotal(total);
      transactionsReport.incrementVolumeTotal(total);
      overallStateReport.incrementVolumeTotal(total);

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
}
