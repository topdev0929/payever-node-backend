import { Injectable } from '@nestjs/common';
import {
  BrowserTransactionsCountDto,
  CountryDevicesReportDto,
  DevicesReportDto, DeviceTransactionsCountDto,
  PaymentMethodDevicesReportDto,
} from '../../dto/volume-report';
import { CountryPaymentMethods, PaymentMethodsEnum, ReportCountriesEnum } from '../../enums';
import { DateRangeService } from './date-range.service';
import { StatisticsCalculator } from './statistics.calculator';
import { VolumeReportCheckoutMetricsRetriever } from './volume-report-checkout-metrics.retriever';
import { ReportDbManager } from './report-db.manager';
import { ReportModel } from '../../models';
import { ReportTypesEnum } from '../../enums/report-types.enum';

type DeviceReportsType = DevicesReportDto | CountryDevicesReportDto | PaymentMethodDevicesReportDto;

@Injectable()
export class DevicesReportManager {
  constructor(
    private readonly metricsRetriever: VolumeReportCheckoutMetricsRetriever,
    private readonly reportDbManager: ReportDbManager,
  ) { }

  public async createDevicesReport(
    dateFrom: Date,
    dateTo: Date,
    country: ReportCountriesEnum,
  ): Promise<DevicesReportDto> {
    const devicesReport: DevicesReportDto = new DevicesReportDto();
    devicesReport.reportDate = DateRangeService.getFormattedReportDateRange(dateFrom, dateTo);
    if (country) {
      await this.calculateDevicesCountByCountry(
        CountryPaymentMethods.get(country),
        devicesReport,
        country,
        dateFrom,
        dateTo,
      );
    } else {
      for (const countryPaymentMethods of CountryPaymentMethods) {
        await this.calculateDevicesCountByCountry(
          countryPaymentMethods[1],
          devicesReport,
          countryPaymentMethods[0],
          dateFrom,
          dateTo,
        );
      }
    }

    this.calculateOverallDevicesStatistics(devicesReport);

    return devicesReport;
  }

  public async prepareDevicesReportFromDb(dateFrom: Date, dateTo: Date): Promise<DevicesReportDto> {
    const devicesReport: DevicesReportDto = new DevicesReportDto();
    devicesReport.reportDate = DateRangeService.getFormattedReportDateRange(dateFrom, dateTo);

    const reports: ReportModel[] =
      await this.reportDbManager.getReportsByTypeAndDate(ReportTypesEnum.devices, dateFrom, dateTo);

    for (const report of reports) {
      const data: DevicesReportDto = report.data as DevicesReportDto;
      StatisticsCalculator.sumStateReports(devicesReport, data);
      DevicesReportManager.sumBrowserTransactionsCount(devicesReport, data);
      DevicesReportManager.sumDeviceTransactionsCount(devicesReport, data);

      for (const countryReport of data.countriesReports) {
        const existingCountryReport: CountryDevicesReportDto =
          devicesReport.countriesReports.find((obj: CountryDevicesReportDto) => obj.country === countryReport.country);
        if (!existingCountryReport) {
          devicesReport.countriesReports.push(countryReport);
          continue;
        }

        StatisticsCalculator.sumStateReports(existingCountryReport, countryReport);
        DevicesReportManager.sumBrowserTransactionsCount(existingCountryReport, countryReport);
        DevicesReportManager.sumDeviceTransactionsCount(existingCountryReport, countryReport);

        for (const paymentMethodReport of countryReport.paymentMethodsReports) {
          const existingPaymentMethodReport: PaymentMethodDevicesReportDto =
            existingCountryReport.paymentMethodsReports.find(
              (obj: PaymentMethodDevicesReportDto) => obj.paymentMethod === paymentMethodReport.paymentMethod,
            );
          if (!existingPaymentMethodReport) {
            existingCountryReport.paymentMethodsReports.push(paymentMethodReport);
            continue;
          }

          StatisticsCalculator.sumStateReports(existingPaymentMethodReport, paymentMethodReport);
          DevicesReportManager.sumBrowserTransactionsCount(existingPaymentMethodReport, paymentMethodReport);
          DevicesReportManager.sumDeviceTransactionsCount(existingPaymentMethodReport, paymentMethodReport);
        }
      }
    }

    this.calculateOverallDevicesStatistics(devicesReport);

    return devicesReport;
  }

  private static sumBrowserTransactionsCount(
    source: DeviceReportsType,
    target: DeviceReportsType,
  ): void {
    for (const browserTransactionsCount of target.browserTransactionsCount) {
      const existingBrowserTransactionsCount: BrowserTransactionsCountDto =
        source.browserTransactionsCount.find(
          (obj: BrowserTransactionsCountDto) => obj.browser === browserTransactionsCount.browser,
        );
      if (!existingBrowserTransactionsCount) {
        source.browserTransactionsCount.push(browserTransactionsCount);
        continue;
      }

      existingBrowserTransactionsCount.transactionsCount += browserTransactionsCount.transactionsCount;
    }
  }

  private static sumDeviceTransactionsCount(
    source: DeviceReportsType,
    target: DeviceReportsType,
  ): void {
    for (const deviceTransactionsCount of target.deviceTransactionsCount) {
      const existingDeviceTransactionsCount: DeviceTransactionsCountDto =
        source.deviceTransactionsCount.find(
          (obj: DeviceTransactionsCountDto) => obj.device === deviceTransactionsCount.device,
        );
      if (!existingDeviceTransactionsCount) {
        source.deviceTransactionsCount.push(deviceTransactionsCount);
        continue;
      }

      existingDeviceTransactionsCount.transactionsCount += deviceTransactionsCount.transactionsCount;
    }
  }

  private async calculateDevicesCountByCountry(
    paymentMethods: PaymentMethodsEnum[],
    devicesReport: DevicesReportDto,
    country: ReportCountriesEnum,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<void> {
    const countryReport: CountryDevicesReportDto = new CountryDevicesReportDto(country);
    devicesReport.countriesReports.push(countryReport);

    for (const paymentMethod of paymentMethods) {
      const paymentMethodReport: PaymentMethodDevicesReportDto = new PaymentMethodDevicesReportDto(paymentMethod);
      countryReport.paymentMethodsReports.push(paymentMethodReport);

      paymentMethodReport.browserTransactionsCount =
        await this.metricsRetriever.getBrowserPaymentsEntries(
          dateFrom,
          dateTo,
          null,
          paymentMethod,
        );

      paymentMethodReport.deviceTransactionsCount =
        await this.metricsRetriever.getDevicePaymentsEntries(
          dateFrom,
          dateTo,
          null,
          paymentMethod,
        );

      await this.calculateBrowserTransactionsCount(
        paymentMethodReport,
        countryReport,
        devicesReport,
      );
    }
  }

  private async calculateBrowserTransactionsCount(
    paymentMethodReport: PaymentMethodDevicesReportDto,
    countryReport: CountryDevicesReportDto,
    devicesReport: DevicesReportDto,
  ): Promise<void> {
    for (const browserTransactionsCount of paymentMethodReport.browserTransactionsCount) {
      paymentMethodReport.transactionsCount += browserTransactionsCount.transactionsCount;
      countryReport.transactionsCount += browserTransactionsCount.transactionsCount;
      devicesReport.transactionsCount += browserTransactionsCount.transactionsCount;

      const countryBrowserEntry: BrowserTransactionsCountDto =
        countryReport.browserTransactionsCount.find(
          (searchCountryBrowserEntry: BrowserTransactionsCountDto) =>
            searchCountryBrowserEntry.browser === browserTransactionsCount.browser,
        );

      const overallBrowserEntry: BrowserTransactionsCountDto =
        devicesReport.browserTransactionsCount.find(
          (searchOverallBrowserEntry: BrowserTransactionsCountDto) =>
            searchOverallBrowserEntry.browser === browserTransactionsCount.browser,
        );

      if (countryBrowserEntry) {
        countryBrowserEntry.transactionsCount += browserTransactionsCount.transactionsCount;
      } else {
        countryReport.browserTransactionsCount.push(Object.assign({ }, browserTransactionsCount));
      }

      if (overallBrowserEntry) {
        overallBrowserEntry.transactionsCount += browserTransactionsCount.transactionsCount;
      } else {
        devicesReport.browserTransactionsCount.push(Object.assign({ }, browserTransactionsCount));
      }
    }

    for (const deviceTransactionsCount of paymentMethodReport.deviceTransactionsCount) {
      const countryDeviceEntry: DeviceTransactionsCountDto =
        countryReport.deviceTransactionsCount.find(
          (searchCountryDeviceEntry: DeviceTransactionsCountDto) =>
            searchCountryDeviceEntry.device === deviceTransactionsCount.device,
        );

      const overallDeviceEntry: DeviceTransactionsCountDto =
        devicesReport.deviceTransactionsCount.find(
          (searchOverallDeviceEntry: DeviceTransactionsCountDto) =>
            searchOverallDeviceEntry.device === deviceTransactionsCount.device,
        );

      if (countryDeviceEntry) {
        countryDeviceEntry.transactionsCount += deviceTransactionsCount.transactionsCount;
      } else {
        countryReport.deviceTransactionsCount.push(Object.assign({ }, deviceTransactionsCount));
      }

      if (overallDeviceEntry) {
        overallDeviceEntry.transactionsCount += deviceTransactionsCount.transactionsCount;
      } else {
        devicesReport.deviceTransactionsCount.push(Object.assign({ }, deviceTransactionsCount));
      }
    }
  }

  private calculateOverallDevicesStatistics(
    devicesReport: DevicesReportDto,
  ): void {
    for (const countryReport of devicesReport.countriesReports) {
      StatisticsCalculator.calculateReportStatistics(countryReport, devicesReport);

      for (const browserCountryReport of countryReport.browserTransactionsCount) {
        StatisticsCalculator.calculateReportStatistics(browserCountryReport, countryReport);
      }
      for (const deviceCountryReport of countryReport.deviceTransactionsCount) {
        StatisticsCalculator.calculateReportStatistics(deviceCountryReport, countryReport);
      }

      for (const paymentMethodReport of countryReport.paymentMethodsReports) {
        StatisticsCalculator.calculateReportStatistics(paymentMethodReport, devicesReport);

        for (const browserReport of paymentMethodReport.browserTransactionsCount) {
          StatisticsCalculator.calculateReportStatistics(browserReport, paymentMethodReport);
        }

        for (const deviceTransactionsReport of paymentMethodReport.deviceTransactionsCount) {
          StatisticsCalculator.calculateReportStatistics(deviceTransactionsReport, paymentMethodReport);
        }
      }
    }

    StatisticsCalculator.calculateReportStatistics(devicesReport, devicesReport);

    for (const browserCountryReport of devicesReport.browserTransactionsCount) {
      StatisticsCalculator.calculateReportStatistics(browserCountryReport, devicesReport);
    }
    for (const deviceCountryReport of devicesReport.deviceTransactionsCount) {
      StatisticsCalculator.calculateReportStatistics(deviceCountryReport, devicesReport);
    }
  }
}
