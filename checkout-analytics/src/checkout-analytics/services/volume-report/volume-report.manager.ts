import { Injectable, PreconditionFailedException } from '@nestjs/common';
import * as moment from 'moment';

import {
  MerchantsReportDto,
  VolumeReportDto,
  MerchantPaymentMethodReportDto,
  ChannelTransactionsReportDto,
  CountryReportDto,
  CountryPaymentMethodReportDto,
  TopMerchantReportDto,
  TransactionsReportDto,
} from '../../dto/volume-report';
import { VolumeTransactionsReportManager } from './volume-transactions-report.manager';
import { VolumeMerchantsReportManager } from './volume-merchants-report.manager';
import { DateRangeService } from './date-range.service';
import { VolumeChannelsReportManager } from './volume-channels-report.manager';
import { ConversionReportManager } from './conversion-report.manager';
import { DevicesReportManager } from './devices-report.manager';
import { ChartsReportManager } from './charts-report.manager';
import { ResponseTimeReportManager } from './response-time-report.manager';
import { ReportTypesEnum } from '../../enums/report-types.enum';
import { ReportDataType } from '../../interfaces';
import { ReportDbManager } from './report-db.manager';
import { ConversionFormReportManager } from './conversion-form-report.manager';
import { ReportCountriesEnum } from '../../enums';

@Injectable()
export class VolumeReportManager {
  constructor(
    private readonly transactionsReportManager: VolumeTransactionsReportManager,
    private readonly chartsReportManager: ChartsReportManager,
    private readonly merchantsReportManager: VolumeMerchantsReportManager,
    private readonly channelsReportManager: VolumeChannelsReportManager,
    private readonly devicesReportManager: DevicesReportManager,
    private readonly responseTimeReportManager: ResponseTimeReportManager,
    private readonly conversionReportManager: ConversionReportManager,
    private readonly reportDbManager: ReportDbManager,
    private readonly conversionFormReportManager: ConversionFormReportManager,
  ) { }

  public async createReport(
    dateFrom: Date = null,
    dateTo: Date = null,
    country?: ReportCountriesEnum,
    ): Promise<VolumeReportDto> {
    if (!dateFrom || !dateTo) {
      dateFrom = DateRangeService.getFirstDayOfLastMonth();
      dateTo = DateRangeService.getLastDayOfLastMonth();
    }

    const volumeReport: VolumeReportDto = new VolumeReportDto();
    volumeReport.reportDateFrom = dateFrom;
    volumeReport.reportDateTo = dateTo;

    volumeReport.transactionsReport = await this.transactionsReportManager.prepareAggregatedTransactionsReport(
      dateFrom,
      dateTo,
      country,
    );

    volumeReport.chartsReport = await this.chartsReportManager.createChartsReport(dateTo, country);

    const dateToLastYear: Date = moment(dateTo).utc().subtract(1, 'year').endOf('year').toDate();
    volumeReport.chartsReportPrevYear =
      await this.chartsReportManager.createChartsReport(dateToLastYear, country);

    volumeReport.merchantsReport = await this.merchantsReportManager.prepareAggregatedMerchantsReport(
      dateFrom,
      dateTo,
      country,
    );

    volumeReport.channelsReport = await this.channelsReportManager.prepareAggregatedChannelsReport(
      dateFrom,
      dateTo,
      country,
    );

    volumeReport.devicesReport = await this.devicesReportManager.createDevicesReport(
      dateFrom,
      dateTo,
      country,
    );

    volumeReport.responseTimeReport = await this.responseTimeReportManager.createResponseTimeReport(
      dateFrom,
      dateTo,
      country,
    );

    volumeReport.conversionReport = await this.conversionReportManager.createConversionReportFromMerchantReport(
      volumeReport.merchantsReport,
      dateFrom,
      dateTo,
    );

    return volumeReport;
  }

  public async prepareReportFromDb(
    dateFrom: Date = null,
    dateTo: Date = null,
    previousDateFrom: Date = null,
    previousDateTo: Date = null,
    country: ReportCountriesEnum,
  ): Promise<VolumeReportDto> {
    if (!dateFrom || !dateTo) {
      dateFrom = DateRangeService.getFirstDayOfLastMonth();
      dateTo = DateRangeService.getLastDayOfLastMonth();
      previousDateFrom = DateRangeService.getFirstDayOfPreviousMonth();
      previousDateTo = DateRangeService.getLastDayOfPreviousMonth();
    }
    let volumeReport: VolumeReportDto = new VolumeReportDto();
    volumeReport.reportDateFrom = dateFrom;
    volumeReport.reportDateTo = dateTo;

    const previousVolumeReport: VolumeReportDto = new VolumeReportDto();
    volumeReport.reportDateFrom = previousDateFrom;
    volumeReport.reportDateTo = previousDateTo;

    volumeReport.transactionsReport = await this.transactionsReportManager.prepareAggregatedTransactionsReport(
      dateFrom,
      dateTo,
      country,
    );

    previousVolumeReport.transactionsReport = await this.transactionsReportManager.prepareAggregatedTransactionsReport(
      previousDateFrom,
      previousDateTo,
      country,
    );

    volumeReport.chartsReport = await this.chartsReportManager.createChartsReport(dateTo, country);

    const dateToLastYear: Date = moment(dateTo).utc().subtract(1, 'year').endOf('year').toDate();
    volumeReport.chartsReportPrevYear =
      await this.chartsReportManager.preparePrevYearChartsReportFromDb(dateToLastYear);

    volumeReport.merchantsReport = await this.merchantsReportManager.prepareAggregatedMerchantsReport(
      dateFrom,
      dateTo,
      country,
    );

    previousVolumeReport.merchantsReport = await this.merchantsReportManager.prepareAggregatedMerchantsReport(
      previousDateFrom,
      previousDateTo,
      country,
    );

    volumeReport.channelsReport = await this.channelsReportManager.prepareAggregatedChannelsReport(
      dateFrom,
      dateTo,
      country,
    );

    previousVolumeReport.channelsReport = await this.channelsReportManager.prepareAggregatedChannelsReport(
      previousDateFrom,
      previousDateTo,
      country,
    );

    volumeReport.devicesReport = await this.devicesReportManager.prepareDevicesReportFromDb(
      dateFrom,
      dateTo,
    );

    volumeReport.responseTimeReport = await this.responseTimeReportManager.prepareResponseTimeReportFromDb(
      dateFrom,
      dateTo,
      country,
    );

    volumeReport.conversionReport = await this.conversionReportManager.createConversionReportFromMerchantReport(
      volumeReport.merchantsReport,
      dateFrom,
      dateTo,
    );

    volumeReport.conversionFormReport = await this.conversionFormReportManager.prepareConversionReportFromDb(
      dateFrom,
      dateTo,
    );

    volumeReport = this.calculateTrends(volumeReport, previousVolumeReport);

    return volumeReport;
  }

  public async generateReportForDbByType(
    type: ReportTypesEnum,
    dateFrom: Date,
    dateTo: Date,
    country: ReportCountriesEnum,
    merchantsReport?: MerchantsReportDto,
  ): Promise<ReportDataType> {
    switch (type) {
      case ReportTypesEnum.chartsPrevYear:
        return this.chartsReportManager.createChartsReport(dateTo, country);
      case ReportTypesEnum.devices:
        return this.devicesReportManager.createDevicesReport(
          dateFrom,
          dateTo,
          country,
        );
      case ReportTypesEnum.responseTime:
        return this.responseTimeReportManager.createResponseTimeReport(
          dateFrom,
          dateTo,
          country,
        );
      case ReportTypesEnum.conversion:
        if (!merchantsReport) {
          throw new PreconditionFailedException('merchantsReport arg is required');
        }

        return this.conversionReportManager.createConversionReportFromMerchantReport(
          merchantsReport,
          dateFrom,
          dateTo,
        );
    }
  }

  public async generateAndSaveReportToDbByType(
    type: ReportTypesEnum,
    country: ReportCountriesEnum,
    from: Date = null,
    to: Date = null,
  ): Promise<void> {
    if (type === ReportTypesEnum.merchantsAndConversion) {
      const merchantsReport: MerchantsReportDto =
        await this.merchantsReportManager.prepareAggregatedMerchantsReport(from, to, country);

      const conversionReport: ReportDataType =
        await this.generateReportForDbByType(
          ReportTypesEnum.conversion,
          from,
          to,
          country,
          merchantsReport,
        );
      await this.reportDbManager.storeReportData({
        data: conversionReport,
        from,
        to,
        type: ReportTypesEnum.conversion,
      });
    } else if (type === ReportTypesEnum.chartsPrevYear) {
      to = moment(to).utc().subtract(1, 'year').endOf('year').toDate();
      from = moment(to).utc().startOf('year').toDate();
      const data: ReportDataType =
        await this.generateReportForDbByType(ReportTypesEnum.chartsPrevYear, from, to, country);
      await this.reportDbManager.storeReportData({ data, from, to, type: ReportTypesEnum.chartsPrevYear });
    } else {
      const data: ReportDataType = await this.generateReportForDbByType(type, from, to, country);
      await this.reportDbManager.storeReportData({ data, from, to, type });
    }
  }

  public countryCodeToCountryEnum(country: string): ReportCountriesEnum {
    country = country?.replace(' ', '')?.toLowerCase();
    if (['uk', 'unitedkingdom'].includes(country)) {
      return ReportCountriesEnum.unitedKingdom;
    }
    if (['fi', 'finland'].includes(country)) {
      return ReportCountriesEnum.finland;
    }
    if (['de', 'germany'].includes(country)) {
      return ReportCountriesEnum.germany;
    }
    if (['at', 'austria'].includes(country)) {
      return ReportCountriesEnum.austria;
    }
    if (['se', 'sweden'].includes(country)) {
      return ReportCountriesEnum.sweden;
    }
    if (['dk', 'denmark'].includes(country)) {
      return ReportCountriesEnum.denmark;
    }
    if (['nl', 'netherlands'].includes(country)) {
      return ReportCountriesEnum.netherlands;
    }
    if (['no', 'norway'].includes(country)) {
      return ReportCountriesEnum.norway;
    }
  }

  private calculateTrends(volumeReport: VolumeReportDto, previousVolumeReport: VolumeReportDto): VolumeReportDto {
    volumeReport.transactionsReport = this.calculateTrendsTransactionsReport(
      volumeReport.transactionsReport,
      previousVolumeReport.transactionsReport,
    );

    for (const payment of volumeReport.merchantsReport.paymentMethodsReports) {
      const previousPayment: MerchantPaymentMethodReportDto =
        previousVolumeReport.merchantsReport.paymentMethodsReports.find((item: MerchantPaymentMethodReportDto) =>
          item.paymentMethod === payment.paymentMethod);
      if (previousPayment) {
        payment.transactionsCountTrendPercent =
          VolumeReportManager.calculateProportion(payment.transactionsCount, previousPayment.transactionsCount);
        for (const topMerchant of payment.topMerchantsReports) {
          topMerchant.transactionsCountTrendPercent = VolumeReportManager.calculateProportion(
            topMerchant.transactionsCount,
            previousPayment.topMerchantsReports.find((item: TopMerchantReportDto) =>
              item.merchantId === topMerchant.merchantId)?.transactionsCount,
          );
        }
      }
    }

    for (let channel of volumeReport.channelsReport.channelTransactionsReports) {
      const previousChannel: ChannelTransactionsReportDto =
        previousVolumeReport.channelsReport.channelTransactionsReports.find((item: ChannelTransactionsReportDto) =>
          item.channel === channel.channel);
      if (previousChannel) {
        channel = this.calculateTrendsTransactionsReport(
          channel,
          previousChannel,
        ) as ChannelTransactionsReportDto;
      }
    }

    return volumeReport;
  }

  private calculateTrendsTransactionsReport(
    transactionsReport: TransactionsReportDto,
    previousTransactionsReport: TransactionsReportDto,
  ): TransactionsReportDto {
    transactionsReport.transactionsCountTrendPercent =
      VolumeReportManager.calculateProportion(
        transactionsReport.transactionsCount,
        previousTransactionsReport.transactionsCount,
      );

    for (const country of transactionsReport.countriesReports) {
      const previousCountry: CountryReportDto =
        previousTransactionsReport.countriesReports.find((item: CountryReportDto) =>
          item.country === country.country);
      if (previousCountry) {
        country.transactionsCountTrendPercent =
          VolumeReportManager.calculateProportion(country.transactionsCount, previousCountry.transactionsCount);
        for (const payment of country.paymentMethodsReports) {
          payment.transactionsCountTrendPercent = VolumeReportManager.calculateProportion(
            payment.transactionsCount,
            previousCountry.paymentMethodsReports.find((item: CountryPaymentMethodReportDto) =>
              item.paymentMethod === payment.paymentMethod)?.transactionsCount,
          );
        }
      }
    }

    return transactionsReport;
  }

  private static calculateProportion(
    value: number = 0,
    totalValue: number = 0,
  ): number {
    return totalValue && value && totalValue > 0 ? (value * 100 / totalValue - 100) : 0;
  }
}
