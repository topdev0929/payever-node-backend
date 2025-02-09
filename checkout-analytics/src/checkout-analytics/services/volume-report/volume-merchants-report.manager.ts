import { Injectable } from '@nestjs/common';
import { VolumeReportTransactionsRetriever } from './volume-report-transactions.retriever';
import {
  MerchantPaymentMethodReportDto,
  MerchantsReportDto,
  StateReportDto,
  TopMerchantReportDto,
  TopMerchantTransactionsCountDto,
} from '../../dto/volume-report';
import { CountryPaymentMethods, PaymentMethodsEnum, ReportCountriesEnum, TransactionStatusesEnum } from '../../enums';
import { REST_MERCHANTS } from '../../constants';
import { CurrencyExchangeService } from '../currency-exchange.service';
import { DateRangeService } from './date-range.service';
import { StatisticsCalculator } from './statistics.calculator';
import { AggregatedTransactionsResultDto } from '../../dto/payment';

@Injectable()
export class VolumeMerchantsReportManager {
  constructor(
    private readonly transactionsRetriever: VolumeReportTransactionsRetriever,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) { }

  public async prepareAggregatedMerchantsReport(
    dateFrom: Date,
    dateTo: Date,
    country: ReportCountriesEnum,
  ): Promise<MerchantsReportDto> {
    const merchantsReport: MerchantsReportDto = new MerchantsReportDto();
    merchantsReport.reportDate = DateRangeService.getFormattedReportDateRange(dateFrom, dateTo);

    await this.calculateAggregatedMerchantsCountAndVolumeByPaymentMethod(merchantsReport, dateFrom, dateTo);
    if (country) {
      for (const paymentMethod of CountryPaymentMethods.get(country)) {
        await this.calculateAggregatedMerchantsCountAndVolumeByPaymentMethod(
          merchantsReport,
          dateFrom,
          dateTo,
          paymentMethod,
        );
      }
    } else {
      for (const countryPaymentMethods of CountryPaymentMethods) {
        for (const paymentMethod of countryPaymentMethods[1]) {
          await this.calculateAggregatedMerchantsCountAndVolumeByPaymentMethod(
            merchantsReport,
            dateFrom,
            dateTo,
            paymentMethod,
          );
        }
      }
    }

    this.calculateOverallMerchantsStatistics(merchantsReport);

    return merchantsReport;
  }

  private async calculateAggregatedMerchantsCountAndVolumeByPaymentMethod(
    merchantsReport: MerchantsReportDto,
    dateFrom: Date,
    dateTo: Date,
    paymentMethod: PaymentMethodsEnum = null,
  ): Promise<void> {
    const paymentMethodReport: MerchantPaymentMethodReportDto = new MerchantPaymentMethodReportDto(paymentMethod);
    merchantsReport.paymentMethodsReports.push(paymentMethodReport);

    const excludeMerchantsIds: string[] = [];
    const topMerchants: TopMerchantTransactionsCountDto[] = await this.transactionsRetriever.findTopMerchants(
      dateFrom,
      dateTo,
      paymentMethod,
    );

    for (const topMerchantDto of topMerchants) {
      if (!topMerchantDto.companyName) {
        return;
      }

      const merchantReport: TopMerchantReportDto =
        new TopMerchantReportDto(topMerchantDto.companyName, topMerchantDto.uuid);
      paymentMethodReport.topMerchantsReports.push(merchantReport);
      excludeMerchantsIds.push(topMerchantDto.uuid);

      const approvedAggregatedResults: AggregatedTransactionsResultDto[] =
        await this.transactionsRetriever.findAggregatedTransactions({
          businessId: topMerchantDto.uuid,
          considerUpdatedTransactions: true,
          dateFrom,
          dateTo,
          paymentMethod,
          status: TransactionStatusesEnum.approved,
        });
      await this.calculateAggregatedMerchantCountAndVolume(
        approvedAggregatedResults,
        merchantReport,
        paymentMethodReport,
        TransactionStatusesEnum.approved,
      );

      const inProcessAggregatedResults: AggregatedTransactionsResultDto[] =
        await this.transactionsRetriever.findAggregatedTransactions({
          businessId: topMerchantDto.uuid,
          considerUpdatedTransactions: true,
          dateFrom,
          dateTo,
          paymentMethod,
          status: TransactionStatusesEnum.inProcess,
        });
      await this.calculateAggregatedMerchantCountAndVolume(
        inProcessAggregatedResults,
        merchantReport,
        paymentMethodReport,
        TransactionStatusesEnum.inProcess,
      );

      const rejectedAggregatedResults: AggregatedTransactionsResultDto[] =
        await this.transactionsRetriever.findAggregatedTransactions({
          businessId: topMerchantDto.uuid,
          considerUpdatedTransactions: true,
          dateFrom,
          dateTo,
          paymentMethod,
          status: TransactionStatusesEnum.rejected,
        });
      await this.calculateAggregatedMerchantCountAndVolume(
        rejectedAggregatedResults,
        merchantReport,
        paymentMethodReport,
        TransactionStatusesEnum.rejected,
      );
    }

    if (!topMerchants.length) {
      return;
    }

    const restMerchantReport: TopMerchantReportDto = new TopMerchantReportDto(REST_MERCHANTS);
    paymentMethodReport.topMerchantsReports.push(restMerchantReport);

    const restApprovedAggregatedResults: AggregatedTransactionsResultDto[] =
      await this.transactionsRetriever.findAggregatedTransactions({
        considerUpdatedTransactions: true,
        dateFrom,
        dateTo,
        excludedBusinessIds: excludeMerchantsIds,
        paymentMethod,
        status: TransactionStatusesEnum.approved,
      });
    await this.calculateAggregatedMerchantCountAndVolume(
      restApprovedAggregatedResults,
      restMerchantReport,
      paymentMethodReport,
      TransactionStatusesEnum.approved,
    );

    const restInProcessAggregatedResults: AggregatedTransactionsResultDto[] =
      await this.transactionsRetriever.findAggregatedTransactions({
        considerUpdatedTransactions: true,
        dateFrom,
        dateTo,
        excludedBusinessIds: excludeMerchantsIds,
        paymentMethod,
        status: TransactionStatusesEnum.inProcess,
      });
    await this.calculateAggregatedMerchantCountAndVolume(
      restInProcessAggregatedResults,
      restMerchantReport,
      paymentMethodReport,
      TransactionStatusesEnum.inProcess,
    );

    const restRejectedAggregatedResults: AggregatedTransactionsResultDto[] =
      await this.transactionsRetriever.findAggregatedTransactions({
        considerUpdatedTransactions: true,
        dateFrom,
        dateTo,
        excludedBusinessIds: excludeMerchantsIds,
        paymentMethod,
        status: TransactionStatusesEnum.rejected,
      });
    await this.calculateAggregatedMerchantCountAndVolume(
      restRejectedAggregatedResults,
      restMerchantReport,
      paymentMethodReport,
      TransactionStatusesEnum.rejected,
    );
  }

  private calculateOverallMerchantsStatistics(merchantsReport: MerchantsReportDto): void {
    const paymentMethodReports: MerchantPaymentMethodReportDto[] = merchantsReport.paymentMethodsReports;

    const allPaymentMethodsReport: MerchantPaymentMethodReportDto =
      paymentMethodReports.values().next().value;

    for (const paymentMethodReport of paymentMethodReports) {

      StatisticsCalculator.calculateReportStatistics(
        paymentMethodReport.approvedPaymentMethodReport,
        allPaymentMethodsReport,
      );

      StatisticsCalculator.calculateReportStatistics(
        paymentMethodReport.inProcessPaymentMethodReport,
        allPaymentMethodsReport,
      );

      StatisticsCalculator.calculateReportStatistics(
        paymentMethodReport.rejectedPaymentMethodReport,
        allPaymentMethodsReport,
      );

      StatisticsCalculator.calculateReportStatistics(paymentMethodReport, allPaymentMethodsReport);

      for (const merchantReport of paymentMethodReport.topMerchantsReports) {
        StatisticsCalculator.calculateReportStatistics(merchantReport.approvedReport, merchantReport);
        StatisticsCalculator.calculateReportStatistics(merchantReport.inProcessReport, merchantReport);
        StatisticsCalculator.calculateReportStatistics(merchantReport.rejectedReport, merchantReport);
        StatisticsCalculator.calculateReportStatistics(merchantReport, allPaymentMethodsReport);
      }
    }
  }

  private async calculateAggregatedMerchantCountAndVolume(
    aggregatedResults: AggregatedTransactionsResultDto[],
    merchantReport: TopMerchantReportDto,
    paymentMethodReport: MerchantPaymentMethodReportDto,
    transactionStatus: TransactionStatusesEnum = TransactionStatusesEnum.approved,
  ): Promise<void> {
    const merchantStateReport: StateReportDto =
      transactionStatus === TransactionStatusesEnum.approved
        ? merchantReport.approvedReport
        : transactionStatus === TransactionStatusesEnum.inProcess
          ? merchantReport.inProcessReport :
          merchantReport.rejectedReport;
    const paymentMethodStateReport: StateReportDto =
      transactionStatus === TransactionStatusesEnum.approved
        ? paymentMethodReport.approvedPaymentMethodReport
        : transactionStatus === TransactionStatusesEnum.inProcess
          ? paymentMethodReport.inProcessPaymentMethodReport
          : paymentMethodReport.rejectedPaymentMethodReport;

    for (const result of aggregatedResults) {
      merchantReport.incrementTransactionsCount(result.count);
      merchantStateReport.incrementTransactionsCount(result.count);
      paymentMethodReport.incrementTransactionsCount(result.count);
      paymentMethodStateReport.incrementTransactionsCount(result.count);

      const total: number =
        await this.currencyExchangeService.exchangeVolumeTotal(result.total, result.currency?.toUpperCase());
      merchantReport.incrementVolumeTotal(total);
      merchantStateReport.incrementVolumeTotal(total);
      paymentMethodReport.incrementVolumeTotal(total);
      paymentMethodStateReport.incrementVolumeTotal(total);
    }
  }
}
