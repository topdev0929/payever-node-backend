import { Injectable } from '@nestjs/common';
import {
  CountryResponseTimeReportDto,
  PaymentMethodResponseTimeReportDto,
  ResponseTimeReportDto,
  ResponseTimeStateDto,
} from '../../dto/volume-report';
import { CountryPaymentMethods, PaymentMethodsEnum, ReportCountriesEnum } from '../../enums';
import { DateRangeService } from './date-range.service';
import { VolumeReportApiCallRetriever } from './volume-report-api-call.retriever';
import { VolumeReportOAuthTokenRetriever } from './volume-report-oauth-token.retriever';
import { ReportDbManager } from './report-db.manager';
import { ReportModel } from '../../models';
import { ReportTypesEnum } from '../../enums/report-types.enum';

@Injectable()
export class ResponseTimeReportManager {
  constructor(
    private readonly apiCallRetriever: VolumeReportApiCallRetriever,
    private readonly oauthTokenRetriever: VolumeReportOAuthTokenRetriever,
    private readonly reportDbManager: ReportDbManager,
  ) { }

  public async createResponseTimeReport(
    dateFrom: Date,
    dateTo: Date,
    country: ReportCountriesEnum,
  ): Promise<ResponseTimeReportDto> {
    const responseTimeReport: ResponseTimeReportDto = new ResponseTimeReportDto();
    responseTimeReport.reportDate = DateRangeService.getFormattedReportDateRange(dateFrom, dateTo);

    if (country) {
      await this.calculateResponseTimeByCountry(
        CountryPaymentMethods.get(country),
        responseTimeReport,
        country,
        dateFrom,
        dateTo,
      );
    } else {
      for (const countryPaymentMethods of CountryPaymentMethods) {
        await this.calculateResponseTimeByCountry(
          countryPaymentMethods[1],
          responseTimeReport,
          countryPaymentMethods[0],
          dateFrom,
          dateTo,
        );
      }
    }

    responseTimeReport.paymentCreate =
      await this.apiCallRetriever.getPaymentCreateAvgResponseTime(
        dateFrom,
        dateTo,
      );
    responseTimeReport.shippingGoods =
      await this.apiCallRetriever.getActionAvgResponseTime(
        dateFrom,
        dateTo,
        ['shipping_goods', 'shipped'],
      );
    responseTimeReport.cancel =
      await this.apiCallRetriever.getActionAvgResponseTime(
        dateFrom,
        dateTo,
        ['cancel'],
      );
    responseTimeReport.refund =
      await this.apiCallRetriever.getActionAvgResponseTime(
        dateFrom,
        dateTo,
        ['refund', 'return'],
      );
    responseTimeReport.oauthToken =
      await this.oauthTokenRetriever.getOAuthTokenAvgResponseTime(
        dateFrom,
        dateTo,
      );

    return responseTimeReport;
  }

  public async prepareResponseTimeReportFromDb(
    dateFrom: Date,
    dateTo: Date,
    country: ReportCountriesEnum,
  ): Promise<ResponseTimeReportDto> {
    const responseTimeReport: ResponseTimeReportDto = new ResponseTimeReportDto();
    responseTimeReport.reportDate = DateRangeService.getFormattedReportDateRange(dateFrom, dateTo);

    const reports: ReportModel[] =
      await this.reportDbManager.getReportsByTypeAndDate(ReportTypesEnum.responseTime, dateFrom, dateTo);

    ResponseTimeReportManager.calcAvgResponseTimeForStates(
      responseTimeReport,
      reports.map((report: ReportModel) => report.data as ResponseTimeReportDto),
    );
    if (country) {
      const countryReport: CountryResponseTimeReportDto = new CountryResponseTimeReportDto(country);
      responseTimeReport.countriesReports.push(countryReport);
      ResponseTimeReportManager.calcAvgResponseTimeForStates(
        countryReport,
        reports.map(
          (report: ReportModel) => (report.data as ResponseTimeReportDto).countriesReports.find(
            (obj: CountryResponseTimeReportDto) => obj.country === country,
          ),
        ),
      );

      for (const paymentMethod of CountryPaymentMethods.get(country)) {
        const paymentMethodReport: PaymentMethodResponseTimeReportDto =
          new PaymentMethodResponseTimeReportDto(paymentMethod);
        countryReport.paymentMethodsReports.push(paymentMethodReport);
        ResponseTimeReportManager.calcAvgResponseTimeForStates(
          paymentMethodReport,
          reports.map(
            (report: ReportModel) => (report.data as ResponseTimeReportDto).countriesReports.find(
              (obj: CountryResponseTimeReportDto) => obj.country === country,
            )?.paymentMethodsReports?.find(
              (obj: PaymentMethodResponseTimeReportDto) => obj.paymentMethod === paymentMethod,
            ),
          ),
        );
      }
    } else {
      for (const countryPaymentMethods of CountryPaymentMethods) {
        const countryItem: ReportCountriesEnum = countryPaymentMethods[0];
        const countryReport: CountryResponseTimeReportDto = new CountryResponseTimeReportDto(countryItem);
        responseTimeReport.countriesReports.push(countryReport);
        ResponseTimeReportManager.calcAvgResponseTimeForStates(
          countryReport,
          reports.map(
            (report: ReportModel) => (report.data as ResponseTimeReportDto).countriesReports.find(
              (obj: CountryResponseTimeReportDto) => obj.country === countryItem,
            ),
          ),
        );

        for (const paymentMethod of countryPaymentMethods[1]) {
          const paymentMethodReport: PaymentMethodResponseTimeReportDto =
            new PaymentMethodResponseTimeReportDto(paymentMethod);
          countryReport.paymentMethodsReports.push(paymentMethodReport);
          ResponseTimeReportManager.calcAvgResponseTimeForStates(
            paymentMethodReport,
            reports.map(
              (report: ReportModel) => (report.data as ResponseTimeReportDto).countriesReports.find(
                (obj: CountryResponseTimeReportDto) => obj.country === countryItem,
              )?.paymentMethodsReports?.find(
                (obj: PaymentMethodResponseTimeReportDto) => obj.paymentMethod === paymentMethod,
              ),
            ),
          );
        }
      }

      return responseTimeReport;
    }
  }

  private static calcAvgResponseTimeForStates(
    source: ResponseTimeStateDto,
    targetStates: ResponseTimeStateDto[],
  ): void {
    const fields: string[] = ['paymentCreate', 'cancel', 'refund', 'shippingGoods', 'oauthToken'];

    for (const field of fields) {
      let statesCount: number = targetStates.length;
      let sum: number = 0;
      for (const state of targetStates) {
        if (!state) {
          statesCount -= 1;
          continue;
        }

        const value: number = state[field];
        if (!value) {
          statesCount -= 1;
          continue;
        }

        sum += value;
      }

      source[field] = statesCount ? sum / statesCount : 0;
    }
  }

  private async calculateResponseTimeByCountry(
    paymentMethods: PaymentMethodsEnum[],
    responseTimeReport: ResponseTimeReportDto,
    country: ReportCountriesEnum,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<void> {
    const countryReport: CountryResponseTimeReportDto = new CountryResponseTimeReportDto(country);
    responseTimeReport.countriesReports.push(countryReport);

    for (const paymentMethod of paymentMethods) {
      const paymentMethodReport: PaymentMethodResponseTimeReportDto =
        new PaymentMethodResponseTimeReportDto(paymentMethod);
      countryReport.paymentMethodsReports.push(paymentMethodReport);

      paymentMethodReport.paymentCreate =
        await this.apiCallRetriever.getPaymentCreateAvgResponseTime(
          dateFrom,
          dateTo,
          [paymentMethod],
        );
      paymentMethodReport.shippingGoods =
        await this.apiCallRetriever.getActionAvgResponseTime(
          dateFrom,
          dateTo,
          ['shipping_goods', 'shipped'],
          [paymentMethod],
        );
      paymentMethodReport.cancel =
        await this.apiCallRetriever.getActionAvgResponseTime(
          dateFrom,
          dateTo,
          ['cancel'],
          [paymentMethod],
        );
      paymentMethodReport.refund =
        await this.apiCallRetriever.getActionAvgResponseTime(
          dateFrom,
          dateTo,
          ['refund', 'return'],
          [paymentMethod],
        );
    }

    countryReport.paymentCreate =
      await this.apiCallRetriever.getPaymentCreateAvgResponseTime(
        dateFrom,
        dateTo,
        paymentMethods,
      );
    countryReport.shippingGoods =
      await this.apiCallRetriever.getActionAvgResponseTime(
        dateFrom,
        dateTo,
        ['shipping_goods', 'shipped'],
        paymentMethods,
      );
    countryReport.cancel =
      await this.apiCallRetriever.getActionAvgResponseTime(
        dateFrom,
        dateTo,
        ['cancel'],
        paymentMethods,
      );
    countryReport.refund =
      await this.apiCallRetriever.getActionAvgResponseTime(
        dateFrom,
        dateTo,
        ['refund', 'return'],
        paymentMethods,
      );
  }
}
