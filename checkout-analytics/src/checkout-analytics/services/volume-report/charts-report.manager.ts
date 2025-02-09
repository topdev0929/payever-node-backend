import { Injectable } from '@nestjs/common';
import { VolumeReportTransactionsRetriever } from './volume-report-transactions.retriever';
import {
  ChartsCountryPaymentMethodReportDto,
  ChartsCountryReportDto,
  ChartsReportDto,
  ChartsTotalVolumeDto,
} from '../../dto/volume-report';
import { CountryPaymentMethods, PaymentMethodsEnum, ReportCountriesEnum } from '../../enums';
import { CurrencyExchangeService } from '../currency-exchange.service';
import * as moment from 'moment';
import { ReportDbManager } from './report-db.manager';
import { ReportModel } from '../../models';
import { ReportTypesEnum } from '../../enums/report-types.enum';

@Injectable()
export class ChartsReportManager {
  constructor(
    private readonly transactionsRetriever: VolumeReportTransactionsRetriever,
    private readonly currencyExchangeService: CurrencyExchangeService,
    private readonly reportDbManager: ReportDbManager,
  ) { }

  public async createChartsReport(dateTo: Date, country: ReportCountriesEnum): Promise<ChartsReportDto> {
    const dateFrom: Date = moment(dateTo).utc().startOf('year').toDate();

    const chartsReport: ChartsReportDto = new ChartsReportDto();
    if (country) {
      await this.calculateChartsDataByCountry(
        CountryPaymentMethods.get(country),
        chartsReport,
        country,
        dateFrom,
        dateTo,
      );
    } else {
      for (const countryPaymentMethods of CountryPaymentMethods) {
        await this.calculateChartsDataByCountry(
          countryPaymentMethods[1],
          chartsReport,
          countryPaymentMethods[0],
          dateFrom,
          dateTo,
        );
      }
    }

    return chartsReport;
  }

  public async preparePrevYearChartsReportFromDb(dateTo: Date): Promise<ChartsReportDto> {
    const dateFrom: Date = moment(dateTo).utc().startOf('year').toDate();

    const reports: ReportModel[] =
      await this.reportDbManager.getReportsByTypeAndDate(ReportTypesEnum.chartsPrevYear, dateFrom, dateTo);

    const lastReport: ReportModel = reports.pop();

    return lastReport?.data as ChartsReportDto;
  }

  private async calculateChartsDataByCountry(
    paymentMethods: PaymentMethodsEnum[],
    chartsReport: ChartsReportDto,
    country: ReportCountriesEnum,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<void> {
    const countryReport: ChartsCountryReportDto = new ChartsCountryReportDto(country);
    chartsReport.chartCountriesReports.push(countryReport);

    for (const paymentMethod of paymentMethods) {
      const paymentMethodReport: ChartsCountryPaymentMethodReportDto =
        new ChartsCountryPaymentMethodReportDto(paymentMethod);

      paymentMethodReport.chartsTotalVolume =
        await this.transactionsRetriever.getTotalVolume(dateFrom, dateTo, paymentMethod);

      paymentMethodReport.chartsApprovedTotalVolume =
        await this.transactionsRetriever.getApprovedTotalVolume(dateFrom, dateTo, paymentMethod);

      const sourceCurrency: string = ChartsReportManager.countryToCurrency(country);

      for (const chartsTotalVolume of paymentMethodReport.chartsTotalVolume) {
        if (sourceCurrency !== 'EUR') {
          chartsTotalVolume.total =
            await this.currencyExchangeService.exchangeVolumeTotal(chartsTotalVolume.total, sourceCurrency);
        }

        const existsCountryChartsTotalVolume: ChartsTotalVolumeDto =
          countryReport.chartsTotalVolume.find(
            (searchCountryChartsTotalVolume: ChartsTotalVolumeDto) =>
              searchCountryChartsTotalVolume.month === chartsTotalVolume.month);
        if (existsCountryChartsTotalVolume) {
          existsCountryChartsTotalVolume.total += chartsTotalVolume.total;
        } else {
          countryReport.chartsTotalVolume.push(Object.assign({ }, chartsTotalVolume));
        }
      }

      for (const chartsTotalVolume of paymentMethodReport.chartsApprovedTotalVolume) {
        if (sourceCurrency !== 'EUR') {
          chartsTotalVolume.total =
            await this.currencyExchangeService.exchangeVolumeTotal(chartsTotalVolume.total, sourceCurrency);
        }
      }

      countryReport.paymentMethodsReports.push(paymentMethodReport);
    }
  }

  private static countryToCurrency(country: ReportCountriesEnum): string {
    switch (country) {
      case ReportCountriesEnum.sweden:
        return 'SEK';
      case ReportCountriesEnum.denmark:
        return 'DKK';
      case ReportCountriesEnum.norway:
        return 'NOK';
      case ReportCountriesEnum.germany:
      case ReportCountriesEnum.others:
      default:
        return 'EUR';
    }
  }
}
