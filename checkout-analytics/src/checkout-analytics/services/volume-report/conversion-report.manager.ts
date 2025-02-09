/* eslint-disable guard-for-in */
import { Injectable } from '@nestjs/common';
import { MerchantsReportDto } from '../../dto/volume-report';
import { ConversionReportDto } from '../../dto/volume-report/conversion-report/conversion-report.dto';
import {
  ConversionPaymentMethodReportDto,
} from '../../dto/volume-report/conversion-report/conversion-payment-method-report.dto';
import { VolumeReportCheckoutMetricsRetriever } from './volume-report-checkout-metrics.retriever';
import {
  ConversionPercentageFieldsMapping,
  ConversionReportFieldsEnum,
  CustomMetricsFieldsMapping,
  PaymentMethodsEnum,
  PaymentTypesEnum,
} from '../../enums';
import { ConversionStateReportDto } from '../../dto/volume-report/conversion-state-report.dto';
import {
  ConversionTopMerchantReportDto,
} from '../../dto/volume-report/conversion-report/conversion-top-merchant-report.dto';
import { REST_MERCHANTS } from '../../constants';
import { DateRangeService } from './date-range.service';
import { StatisticsCalculator } from './statistics.calculator';
import { ReportDbManager } from './report-db.manager';
import { ReportModel } from '../../models';
import { ReportTypesEnum } from '../../enums/report-types.enum';

@Injectable()
export class ConversionReportManager {
  constructor(
    private readonly checkoutMetricsRetriever: VolumeReportCheckoutMetricsRetriever,
    private readonly reportDbManager: ReportDbManager,
  ) { }

  public async createConversionReportFromMerchantReport(
    merchantsReport: MerchantsReportDto,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<ConversionReportDto> {
    const conversionReport: ConversionReportDto = new ConversionReportDto();
    conversionReport.reportDate = DateRangeService.getFormattedReportDateRange(dateFrom, dateTo);

    for (const paymentType in PaymentTypesEnum) {
      for (const merchantPaymentMethodReport of merchantsReport.paymentMethodsReports) {

        if (paymentType === PaymentTypesEnum.submit &&
          !this.checkoutMetricsRetriever.isSubmitSupported(merchantPaymentMethodReport.paymentMethod)) {
          continue;
        }

        const excludedBusinessIds: string[] = [];
        const conversionPaymentMethodReport: ConversionPaymentMethodReportDto =
          new ConversionPaymentMethodReportDto(merchantPaymentMethodReport.paymentMethod as PaymentMethodsEnum);

        conversionReport.paymentMethodsReports[paymentType].push(conversionPaymentMethodReport);
        await this.prepareConversionDataForBusinessAndPaymentMethod(
          conversionPaymentMethodReport,
          dateFrom,
          dateTo,
          null,
          conversionPaymentMethodReport.paymentMethod,
          paymentType,
        );

        for (const topMerchantReport of merchantPaymentMethodReport.topMerchantsReports) {
          if (!topMerchantReport.merchantId) {
            continue;
          }

          const conversionTopMerchantReport: ConversionTopMerchantReportDto =
            new ConversionTopMerchantReportDto(topMerchantReport.merchantName, topMerchantReport.merchantId);
          conversionPaymentMethodReport.topMerchantsReports[paymentType].push(conversionTopMerchantReport);

          await this.prepareConversionDataForBusinessAndPaymentMethod(
            conversionTopMerchantReport,
            dateFrom,
            dateTo,
            topMerchantReport.merchantId,
            conversionPaymentMethodReport.paymentMethod,
            paymentType,
          );

          excludedBusinessIds.push(topMerchantReport.merchantId);
        }

        const conversionRestMerchantsReport: ConversionTopMerchantReportDto =
          new ConversionTopMerchantReportDto(REST_MERCHANTS);
        conversionPaymentMethodReport.topMerchantsReports[paymentType].push(conversionRestMerchantsReport);
        await this.prepareConversionDataForLeftBusinessesAndPaymentMethod(
          conversionRestMerchantsReport,
          dateFrom,
          dateTo,
          excludedBusinessIds,
          conversionPaymentMethodReport.paymentMethod,
          paymentType
        );
      }
    }

    return conversionReport;
  }

  public async prepareConversionReportFromDb(
    dateFrom: Date,
    dateTo: Date,
  ): Promise<ConversionReportDto> {
    const conversionReport: ConversionReportDto = new ConversionReportDto();
    conversionReport.reportDate = DateRangeService.getFormattedReportDateRange(dateFrom, dateTo);

    const reports: ReportModel[] =
      await this.reportDbManager.getReportsByTypeAndDate(ReportTypesEnum.conversion, dateFrom, dateTo);

    for (const report of reports) {
      const data: ConversionReportDto = report.data as ConversionReportDto;
      ConversionReportManager.prepareConversionPaymentMethodReportsFromDbData(conversionReport, data);
    }
    for (const paymentType in PaymentTypesEnum) {
      for (const paymentMethodReport of conversionReport.paymentMethodsReports[paymentType]) {
        paymentMethodReport[ConversionReportFieldsEnum.PaidPaymentCount] =
          await this.checkoutMetricsRetriever.countPaidPayments(
            dateFrom,
            dateTo,
            null,
            paymentMethodReport.paymentMethod,
          );

        StatisticsCalculator.calculateConversionStatistics(paymentMethodReport);

        for (const topMerchantReport of paymentMethodReport.topMerchantsReports[paymentType]) {
          if (!topMerchantReport.merchantId) {
            continue;
          }

          topMerchantReport[ConversionReportFieldsEnum.PaidPaymentCount] =
            await this.checkoutMetricsRetriever.countPaidPayments(
              dateFrom,
              dateTo,
              topMerchantReport.merchantId,
              paymentMethodReport.paymentMethod,
            );

          StatisticsCalculator.calculateConversionStatistics(topMerchantReport);
        }
      }
    }


    return conversionReport;
  }

  private static prepareConversionPaymentMethodReportsFromDbData(
    conversionReport: ConversionReportDto,
    dbData: ConversionReportDto,
  ): void {
    for (const paymentType in PaymentTypesEnum) {
      for (const paymentMethodReport of dbData.paymentMethodsReports[paymentType]) {
        const existingPaymentMethodReport: ConversionPaymentMethodReportDto =
          conversionReport.paymentMethodsReports[paymentType].find(
            (obj: ConversionPaymentMethodReportDto) => obj.paymentMethod === paymentMethodReport.paymentMethod,
          );
        if (!existingPaymentMethodReport) {
          conversionReport.paymentMethodsReports[paymentType].push(paymentMethodReport);
          continue;
        }

        ConversionReportManager.sumConversionReports(existingPaymentMethodReport, paymentMethodReport);
        StatisticsCalculator.calculateConversionStatistics(existingPaymentMethodReport);

        for (const topMerchantsReport of paymentMethodReport.topMerchantsReports[paymentType]) {
          const existingTopMerchantsReport: ConversionTopMerchantReportDto =
            existingPaymentMethodReport.topMerchantsReports[paymentType].find(
              (obj: ConversionTopMerchantReportDto) => obj.merchantId
                ? obj.merchantId === topMerchantsReport.merchantId
                : obj.merchantName === topMerchantsReport.merchantName,
            );
          if (!existingTopMerchantsReport) {
            existingPaymentMethodReport.topMerchantsReports[paymentType].push(topMerchantsReport);
            continue;
          }

          ConversionReportManager.sumConversionReports(existingTopMerchantsReport, topMerchantsReport);
          StatisticsCalculator.calculateConversionStatistics(existingTopMerchantsReport);
        }
      }
    }
  }

  private static sumConversionReports(
    target: ConversionStateReportDto,
    source: ConversionStateReportDto,
  ): void {
    target[ConversionReportFieldsEnum.FlowCount] += source[ConversionReportFieldsEnum.FlowCount];
    for (const [countFieldName] of ConversionPercentageFieldsMapping) {
      if (!target[countFieldName]) {
        target[countFieldName] = 0;
      }

      target[countFieldName] += (source[countFieldName] ?? 0);
    }
  }

  private async prepareConversionDataForBusinessAndPaymentMethod(
    conversionStateReportDto: ConversionStateReportDto,
    dateFrom: Date,
    dateTo: Date,
    businessId: string = null,
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<void> {
    conversionStateReportDto[ConversionReportFieldsEnum.FlowCount] =
      await this.checkoutMetricsRetriever.countFlow(
        dateFrom,
        dateTo,
        businessId,
        paymentMethod,
        paymentType,
      );

    conversionStateReportDto[ConversionReportFieldsEnum.NewPaymentCount] =
      await this.checkoutMetricsRetriever.countNewPayments(
        dateFrom,
        dateTo,
        businessId,
        paymentMethod,
        paymentType,
      );

    conversionStateReportDto[ConversionReportFieldsEnum.SuccessPaymentCount] =
      await this.checkoutMetricsRetriever.countSuccessPayments(
        dateFrom,
        dateTo,
        businessId,
        paymentMethod,
        paymentType,
      );

    conversionStateReportDto[ConversionReportFieldsEnum.SuccessExcludeFailedPaymentCount] =
      await this.checkoutMetricsRetriever.countSuccessPayments(
        dateFrom,
        dateTo,
        businessId,
        paymentMethod,
        paymentType,
        false,
      );

    conversionStateReportDto[ConversionReportFieldsEnum.PaidPaymentCount] =
      await this.checkoutMetricsRetriever.countPaidPayments(
        dateFrom,
        dateTo,
        businessId,
        paymentMethod,
        paymentType,
      );

    conversionStateReportDto[ConversionReportFieldsEnum.DeclinedPaymentCount] =
      await this.checkoutMetricsRetriever.countDeclinedPayments(
        dateFrom,
        dateTo,
        businessId,
        paymentMethod,
        paymentType,
      );

    conversionStateReportDto[ConversionReportFieldsEnum.FailedPaymentCount] =
      await this.checkoutMetricsRetriever.countFailedPayments(
        dateFrom,
        dateTo,
        businessId,
        paymentMethod,
        paymentType,
      );

    for (const [fieldName, customMetric] of CustomMetricsFieldsMapping) {
      conversionStateReportDto[fieldName] = await this.checkoutMetricsRetriever.countCustomMetricTriggers(
        customMetric,
        dateFrom,
        dateTo,
        businessId,
        [],
        paymentMethod,
        paymentType,
      );
    }

    StatisticsCalculator.calculateConversionStatistics(conversionStateReportDto);
  }

  private async prepareConversionDataForLeftBusinessesAndPaymentMethod(
    conversionStateReportDto: ConversionStateReportDto,
    dateFrom: Date,
    dateTo: Date,
    excludedBusinessIds: string[],
    paymentMethod: PaymentMethodsEnum = null,
    paymentType: string = null,
  ): Promise<void> {
    conversionStateReportDto[ConversionReportFieldsEnum.FlowCount] =
      await this.checkoutMetricsRetriever.countFlowWithExcludedBusinesses(
        dateFrom,
        dateTo,
        excludedBusinessIds,
        paymentMethod,
        paymentType,
      );

    conversionStateReportDto[ConversionReportFieldsEnum.NewPaymentCount] =
      await this.checkoutMetricsRetriever.countNewPaymentsWithExcludedBusinesses(
        dateFrom,
        dateTo,
        excludedBusinessIds,
        paymentMethod,
        paymentType,
      );

    conversionStateReportDto[ConversionReportFieldsEnum.SuccessPaymentCount] =
      await this.checkoutMetricsRetriever.countSuccessPaymentsWithExcludedBusinesses(
        dateFrom,
        dateTo,
        excludedBusinessIds,
        paymentMethod,
        paymentType,
      );

    conversionStateReportDto[ConversionReportFieldsEnum.SuccessExcludeFailedPaymentCount] =
      await this.checkoutMetricsRetriever.countSuccessPaymentsWithExcludedBusinesses(
        dateFrom,
        dateTo,
        excludedBusinessIds,
        paymentMethod,
        paymentType,
        false,
      );

    conversionStateReportDto[ConversionReportFieldsEnum.PaidPaymentCount] =
      await this.checkoutMetricsRetriever.countPaidPaymentsWithExcludedBusinesses(
        dateFrom,
        dateTo,
        excludedBusinessIds,
        paymentMethod,
        paymentType,
      );

    conversionStateReportDto[ConversionReportFieldsEnum.DeclinedPaymentCount] =
      await this.checkoutMetricsRetriever.countDeclinedPaymentsWithExcludedBusinesses(
        dateFrom,
        dateTo,
        excludedBusinessIds,
        paymentMethod,
        paymentType,
      );

    conversionStateReportDto[ConversionReportFieldsEnum.FailedPaymentCount] =
      await this.checkoutMetricsRetriever.countFailedPaymentsWithExcludedBusinesses(
        dateFrom,
        dateTo,
        excludedBusinessIds,
        paymentMethod,
        paymentType,
      );

    for (const [fieldName, customMetric] of CustomMetricsFieldsMapping) {
      conversionStateReportDto[fieldName] = await this.checkoutMetricsRetriever.countCustomMetricTriggers(
        customMetric,
        dateFrom,
        dateTo,
        null,
        excludedBusinessIds,
        paymentMethod,
        paymentType,
      );
    }

    StatisticsCalculator.calculateConversionStatistics(conversionStateReportDto);
  }
}
