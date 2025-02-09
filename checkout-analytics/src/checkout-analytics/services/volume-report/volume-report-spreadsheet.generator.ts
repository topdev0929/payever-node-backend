/* eslint-disable guard-for-in */
/* tslint:disable:object-literal-sort-keys */
/* tslint:disable:no-identical-functions */
import { Injectable } from '@nestjs/common';
import * as Excel from 'exceljs';
import * as moment from 'moment';
import { capitalize } from 'lodash';
import * as ArrayBufferEncoder from 'base64-arraybuffer';

import {
  BrowserTransactionsCountDto,
  ChannelsReportDto,
  ChannelTransactionsReportDto, ChartsCountryPaymentMethodReportDto,
  ChartsCountryReportDto,
  ChartsReportDto,
  ChartsTotalVolumeDto,
  CountryDevicesReportDto,
  CountryPaymentMethodReportDto,
  CountryReportDto, CountryResponseTimeReportDto,
  DevicesReportDto,
  DeviceTransactionsCountDto,
  MerchantPaymentMethodReportDto,
  MerchantsReportDto,
  PaymentMethodDevicesReportDto, PaymentMethodResponseTimeReportDto, ResponseTimeReportDto, ResponseTimeStateDto,
  StateReportDto,
  TopMerchantReportDto,
  TransactionsReportDto,
  VolumeReportDto,
  ConversionPaymentMethodReportDto,
} from '../../dto';
import {
  REPORT_HEADER_COLOR,
  REPORT_OVERALL_COLOR,
  VOLUME_OVERALL_TITLE,
  DEFAULT_COLUMN_WIDTH,
  REPORT_DISABLED_COLOR,
  REPORT_DISABLED_TEXT,
} from '../../constants';
import { ConversionReportDto } from '../../dto/volume-report/conversion-report/conversion-report.dto';
import {
  ConversionTopMerchantReportDto,
} from '../../dto/volume-report/conversion-report/conversion-top-merchant-report.dto';
import { ConversionStateReportDto } from '../../dto/volume-report/conversion-state-report.dto';
import {
  AllowedPaymentMethodsForCharts,
  ConversionReportFieldsEnum,
  ConversionTitleFieldsMapping,
  DefaultPaymentMethodFieldsMapping,
  PaymentMethodFieldsMapping,
  PaymentMethodsNames,
  ReportCountriesEnum,
  ConversionFormReportFieldsEnum,
  PaymentMethodFormFieldsMapping,
  ConversionFormTitleFieldsMapping,
  PaymentTypesEnum,
} from '../../enums';
import * as googleChartsNode from '../../chart-renderer';
import {
  ConversionFormReportDto,
  ConversionPaymentMethodFormReportDto,
  ConversionPaymentMethodFormDto,
  ConversionPaymentMethodFieldDto,
} from '../../dto/volume-report/conversion-form-report';
import { VolumeReportCheckoutMetricsRetriever } from './volume-report-checkout-metrics.retriever';
@Injectable()
export class VolumeReportSpreadsheetGenerator {
  constructor(
    private readonly checkoutMetricsRetriever: VolumeReportCheckoutMetricsRetriever,
  ) { }

  public async generateVolumeReportContent(volumeReport: VolumeReportDto): Promise<string> {
    const workbook: Excel.Workbook = new Excel.Workbook();

    const transactionsWorksheet: Excel.Worksheet = workbook.addWorksheet('Transactions Volume Report');
    const merchantsWorksheet: Excel.Worksheet = workbook.addWorksheet('Merchants Volume Report');
    const channelsWorksheet: Excel.Worksheet = workbook.addWorksheet('Channels Volume Report');
    const devicesWorksheet: Excel.Worksheet = workbook.addWorksheet('Devices Report');
    const responseTimeWorksheet: Excel.Worksheet = workbook.addWorksheet('Response Time Report');

    await this.setTransactionsReportData(
      volumeReport.transactionsReport,
      volumeReport.chartsReport,
      transactionsWorksheet,
      workbook,
    );
    this.setMerchantsReportData(volumeReport.merchantsReport, merchantsWorksheet);
    this.setChannelsReportData(volumeReport.channelsReport, channelsWorksheet);
    this.setDevicesReportData(volumeReport.devicesReport, devicesWorksheet);
    this.setResponseTimeReportData(volumeReport.responseTimeReport, responseTimeWorksheet);

    await this.setConversionReportData(volumeReport.conversionReport, volumeReport, workbook);

    await this.setConversionFormReportData(volumeReport.conversionFormReport, volumeReport, workbook);

    const reportBuffer: Excel.Buffer = await workbook.xlsx.writeBuffer();

    return ArrayBufferEncoder.encode(reportBuffer);
  }

  private async setTransactionsReportData(
    transactionsReport: TransactionsReportDto,
    chartsReport: ChartsReportDto,
    worksheet: Excel.Worksheet,
    workbook: Excel.Workbook,
  ): Promise<void> {
    this.setReportHeader(
      worksheet,
      `Transactions ${transactionsReport.reportDate}`,
      ['Active Merchants'],
    );

    transactionsReport.countriesReports.forEach((countryReport: CountryReportDto) => {
      this.writeReportData(
        worksheet,
        countryReport,
        countryReport.approvedCountryReport,
        countryReport.inProcessCountryReport,
        countryReport.rejectedCountryReport,
        countryReport.country,
        true,
      );

      this.setRowFontBold(worksheet.lastRow);
      this.setRowFillColor(worksheet.lastRow);

      countryReport.paymentMethodsReports.forEach((paymentMethodReport: CountryPaymentMethodReportDto) => {
        this.writeReportData(
          worksheet,
          paymentMethodReport,
          paymentMethodReport.approvedReport,
          paymentMethodReport.inProcessReport,
          paymentMethodReport.rejectedReport,
          paymentMethodReport.paymentMethod,
          true,
        );
      });

      this.addEmptyRows(worksheet, 1);
    });

    this.writeReportData(
      worksheet,
      transactionsReport,
      transactionsReport.overallApprovedReport,
      transactionsReport.overallInProcessReport,
      transactionsReport.overallRejectedReport,
      VOLUME_OVERALL_TITLE,
      true,
    );

    this.setRowFontBold(worksheet.lastRow);
    this.setRowFillColor(worksheet.lastRow);

    this.addEmptyRows(worksheet, 4);

    await this.setChartsReportDataByCountry(chartsReport, worksheet, workbook);
  }

  private setMerchantsReportData(
    merchantsReport: MerchantsReportDto,
    worksheet: Excel.Worksheet,
  ): void {
    this.setReportHeader(
      worksheet,
      `Merchants ${merchantsReport.reportDate}`,
    );

    merchantsReport.paymentMethodsReports.forEach((paymentMethodReport: MerchantPaymentMethodReportDto) => {
      this.writeReportData(
        worksheet,
        paymentMethodReport,
        paymentMethodReport.approvedPaymentMethodReport,
        paymentMethodReport.inProcessPaymentMethodReport,
        paymentMethodReport.rejectedPaymentMethodReport,
        paymentMethodReport.paymentMethod ? paymentMethodReport.paymentMethod : VOLUME_OVERALL_TITLE,
      );

      this.setRowFontBold(worksheet.lastRow);
      this.setRowFillColor(worksheet.lastRow);

      paymentMethodReport.topMerchantsReports.forEach((topMerchantReport: TopMerchantReportDto) => {
        this.writeReportData(
          worksheet,
          topMerchantReport,
          topMerchantReport.approvedReport,
          topMerchantReport.inProcessReport,
          topMerchantReport.rejectedReport,
          topMerchantReport.merchantName,
        );
      });

      this.addEmptyRows(worksheet, 1);
    });
  }

  private setChannelsReportData(
    channelsReport: ChannelsReportDto,
    worksheet: Excel.Worksheet,
  ): void {
    this.setReportHeader(
      worksheet,
      `Channels ${channelsReport.reportDate}`,
      ['Active Merchants'],
    );

    channelsReport.channelTransactionsReports.forEach((channelTransactionsReport: ChannelTransactionsReportDto) => {
      channelTransactionsReport.countriesReports.forEach((countryReport: CountryReportDto) => {
        this.writeReportData(
          worksheet,
          countryReport,
          countryReport.approvedCountryReport,
          countryReport.inProcessCountryReport,
          countryReport.rejectedCountryReport,
          `${channelTransactionsReport.channel} - ${countryReport.country}`,
          true,
        );

        this.setRowFontBold(worksheet.lastRow);
        this.setRowFillColor(worksheet.lastRow);

        /* tslint:disable-next-line */
        countryReport.paymentMethodsReports.forEach((paymentMethodReport: CountryPaymentMethodReportDto) => {
          this.writeReportData(
            worksheet,
            paymentMethodReport,
            paymentMethodReport.approvedReport,
            paymentMethodReport.inProcessReport,
            paymentMethodReport.rejectedReport,
            paymentMethodReport.paymentMethod,
            true,
          );
        });

        this.addEmptyRows(worksheet, 1);
      });

      this.writeReportData(
        worksheet,
        channelTransactionsReport,
        channelTransactionsReport.overallApprovedReport,
        channelTransactionsReport.overallInProcessReport,
        channelTransactionsReport.overallRejectedReport,
        `${channelTransactionsReport.channel} - Total`,
        true,
      );

      this.setRowFontBold(worksheet.lastRow);
      this.setRowFillColor(worksheet.lastRow);

      this.addEmptyRows(worksheet, 2);
    });
  }

  private setDevicesReportData(
    devicesReport: DevicesReportDto,
    worksheet: Excel.Worksheet,
  ): void {
    this.setDevicesReportHeader(
      worksheet,
      `Devices ${devicesReport.reportDate}`,
    );

    devicesReport.countriesReports.forEach((countryReport: CountryDevicesReportDto) => {
      this.writeDevicesData(
        worksheet,
        countryReport,
        countryReport.country,
      );

      this.setRowFontBold(worksheet.lastRow);
      this.setRowFillColor(worksheet.lastRow);

      countryReport.deviceTransactionsCount.forEach((deviceTransactionsReport: DeviceTransactionsCountDto) => {
        this.writeDevicesData(
          worksheet,
          deviceTransactionsReport,
          deviceTransactionsReport.device,
        );
      });

      worksheet.addRow(['--------------------']);

      countryReport.browserTransactionsCount.forEach((browserTransactionsReport: BrowserTransactionsCountDto) => {
        this.writeDevicesData(
          worksheet,
          browserTransactionsReport,
          browserTransactionsReport.browser,
        );
      });

      this.addEmptyRows(worksheet, 2);

      countryReport.paymentMethodsReports.forEach((paymentMethodReport: PaymentMethodDevicesReportDto) => {
        this.writeDevicesData(
          worksheet,
          paymentMethodReport,
          paymentMethodReport.paymentMethod,
        );

        this.setRowFontBold(worksheet.lastRow);

        /* tslint:disable-next-line */
        paymentMethodReport.deviceTransactionsCount.forEach((deviceTransactionsReport: DeviceTransactionsCountDto) => {
          this.writeDevicesData(
            worksheet,
            deviceTransactionsReport,
            deviceTransactionsReport.device,
          );
        });

        worksheet.addRow(['--------------------']);

        paymentMethodReport.browserTransactionsCount.forEach(
          /* tslint:disable-next-line */
          (browserTransactionsReport: BrowserTransactionsCountDto) => {
            this.writeDevicesData(
              worksheet,
              browserTransactionsReport,
              browserTransactionsReport.browser,
            );
          });

        this.addEmptyRows(worksheet, 1);
      });

      this.addEmptyRows(worksheet, 1);
    });

    this.writeDevicesData(
      worksheet,
      devicesReport,
      VOLUME_OVERALL_TITLE,
    );

    this.setRowFontBold(worksheet.lastRow);
    this.setRowFillColor(worksheet.lastRow);

    /* tslint:disable-next-line */
    devicesReport.deviceTransactionsCount.forEach((deviceTransactionsReport: DeviceTransactionsCountDto) => {
      this.writeDevicesData(
        worksheet,
        deviceTransactionsReport,
        deviceTransactionsReport.device,
      );
    });

    worksheet.addRow(['--------------------']);

    /* tslint:disable-next-line */
    devicesReport.browserTransactionsCount.forEach((browserTransactionsReport: BrowserTransactionsCountDto) => {
      this.writeDevicesData(
        worksheet,
        browserTransactionsReport,
        browserTransactionsReport.browser,
      );
    });

    this.addEmptyRows(worksheet, 4);
  }

  private setResponseTimeReportData(
    responseTimeReport: ResponseTimeReportDto,
    worksheet: Excel.Worksheet,
  ): void {
    this.setResponseTimeReportHeader(
      worksheet,
      `Response Time ${responseTimeReport.reportDate}`,
    );

    responseTimeReport.countriesReports.forEach((countryReport: CountryResponseTimeReportDto) => {
      this.writeResponseTimeData(
        worksheet,
        countryReport,
        countryReport.country,
      );

      this.setRowFontBold(worksheet.lastRow);
      this.setRowFillColor(worksheet.lastRow);

      countryReport.paymentMethodsReports.forEach((paymentMethodReport: PaymentMethodResponseTimeReportDto) => {
        this.writeResponseTimeData(
          worksheet,
          paymentMethodReport,
          paymentMethodReport.paymentMethod,
        );
      });

      this.addEmptyRows(worksheet, 1);
    });

    this.writeResponseTimeData(
      worksheet,
      responseTimeReport,
      VOLUME_OVERALL_TITLE,
    );

    this.setRowFontBold(worksheet.lastRow);
    this.setRowFillColor(worksheet.lastRow);
  }

  private async setChartsReportDataByCountry(
    chartsReport: ChartsReportDto,
    worksheet: Excel.Worksheet,
    workbook: Excel.Workbook,
  ): Promise<void> {
    const chartData: any[] = [];
    for (let i: number = 1; i <= 12; i++) {
      const monthChartData: any[] = [];
      const monthName: string = moment.months(i - 1);
      const chartCountries: ReportCountriesEnum[] = [
        ReportCountriesEnum.norway,
        ReportCountriesEnum.denmark,
        ReportCountriesEnum.sweden,
        ReportCountriesEnum.germany,
        ReportCountriesEnum.netherlands,
        ReportCountriesEnum.austria,
      ];

      monthChartData.push(monthName);

      for (const country of chartCountries) {
        const countryData: ChartsCountryReportDto = chartsReport.chartCountriesReports.find(
          (search: ChartsCountryReportDto) => search.country === country);
        if (!countryData) {
          monthChartData.push(0);
          continue;
        }
        const countryMonthData: ChartsTotalVolumeDto =
          countryData.chartsTotalVolume.find(
            (search: ChartsTotalVolumeDto) => search.month === i);
        const countryMonthTotal: number = countryMonthData ? countryMonthData.total : 0;

        monthChartData.push(countryMonthTotal);
      }

      chartData.push(monthChartData);
    }

    const drawChartStr: string = `
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Months');
      data.addColumn('number', 'Norway');
      data.addColumn('number', 'Denmark');
      data.addColumn('number', 'Sweden');
      data.addColumn('number', 'Germany');
      data.addColumn('number', 'Netherlands');
      data.addColumn('number', 'Austria');
      data.addRows(${JSON.stringify(chartData)});
      var options = { title: 'Total volume', colors: ['blue', 'red', 'gold', 'black', 'green', 'grey']  };
      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    `;

    const image: Buffer = await googleChartsNode.render(drawChartStr, {
      width: 1200,
      height: 800,
      packages: ['corechart', 'bar'],
    });

    const imageId: any = workbook.addImage({
      buffer: image,
      extension: 'png',
    });

    worksheet.addImage(imageId, 'A45:G80');
  }

  private async setChartsReportDataByPaymentMethod(
    chartsReport: ChartsCountryPaymentMethodReportDto,
    chartsReportPrevYear: ChartsCountryPaymentMethodReportDto,
    worksheet: Excel.Worksheet,
    workbook: Excel.Workbook,
    volumeReport: VolumeReportDto,
  ): Promise<void> {
    const chartData: any[] = [];
    for (let i: number = 1; i <= 12; i++) {
      const monthChartData: any[] = [];
      const monthName: string = moment.months(i - 1);

      monthChartData.push(monthName);

      const monthDataPrevYear: ChartsTotalVolumeDto = chartsReportPrevYear
        ? chartsReportPrevYear.chartsApprovedTotalVolume.find(
          (search: ChartsTotalVolumeDto) => search.month === i)
        : null;
      const monthTotalPrevYear: number = monthDataPrevYear ? monthDataPrevYear.total : 0;

      monthChartData.push(monthTotalPrevYear);

      const monthData: ChartsTotalVolumeDto = chartsReport
        ? chartsReport.chartsApprovedTotalVolume.find(
          (search: ChartsTotalVolumeDto) => search.month === i)
        : null;
      const monthTotal: number = monthData ? monthData.total : 0;

      monthChartData.push(monthTotal);

      chartData.push(monthChartData);
    }

    const prevYear: string = moment(volumeReport.reportDateTo).utc().subtract(1, 'year').format('YYYY');
    const currentYear: string = moment(volumeReport.reportDateTo).utc().format('YYYY');

    const drawChartStr: string = `
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Months');
      data.addColumn('number', '${prevYear}');
      data.addColumn('number', '${currentYear}');
      data.addRows(${JSON.stringify(chartData)});
      var options = { title: '${PaymentMethodsNames.get(chartsReport.paymentMethod)}', colors: ['red', 'black'] };
      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    `;

    const image: Buffer = await googleChartsNode.render(drawChartStr, {
      width: 1200,
      height: 900,
      packages: ['corechart', 'bar'],
    });

    const imageId: any = workbook.addImage({
      buffer: image,
      extension: 'png',
    });

    worksheet.addImage(imageId, 'A20:G60');
  }

  private async setChartsFormReportDataByPaymentMethod(
    paymentMethodFormReport: ConversionPaymentMethodFormReportDto,
    worksheet: Excel.Worksheet,
    workbook: Excel.Workbook,
    volumeReport: VolumeReportDto,
  ): Promise<void> {
    if (paymentMethodFormReport.allForms === 0) {
      return;
    }

    const chartData: any[] = [
      ['Forms', 'Completed', 'Incompleted', { role: 'annotation' }],
    ];
    paymentMethodFormReport.fields.forEach((item: ConversionPaymentMethodFieldDto) => {
      chartData.push([
        item.name,
        item.percent,
        100 - item.percent,
        '',
      ]);
    });
    chartData.push(['Status', paymentMethodFormReport.completedForms, paymentMethodFormReport.incompletedForms, '']);

    const drawChartStr: string = `
      var data = new google.visualization.arrayToDataTable(${JSON.stringify(chartData)});
      var options = { title: '', isStacked: 'percent' };
      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    `;

    const image: Buffer = await googleChartsNode.render(drawChartStr, {
      width: 1200,
      height: 900,
      packages: ['corechart', 'bar'],
    });

    const imageId: any = workbook.addImage({
      buffer: image,
      extension: 'png',
    });

    worksheet.addImage(imageId, 'A10:G50');
  }

  private async setConversionReportData(
    conversionReport: ConversionReportDto,
    volumeReport: VolumeReportDto,
    workbook: Excel.Workbook,
  ): Promise<void> {

    for (const paymentType in PaymentTypesEnum) {
      const paymentMethodsReports: ConversionPaymentMethodReportDto[]
        = conversionReport.paymentMethodsReports[paymentType];

      for (const paymentMethodReport of paymentMethodsReports) {
        if (
          paymentType === PaymentTypesEnum.submit &&
          !this.checkoutMetricsRetriever.isSubmitSupported(paymentMethodReport.paymentMethod)
        ) {
          continue;
        }
        const conversionTitle: string =
          paymentMethodReport.paymentMethod
            ? PaymentMethodsNames.get(paymentMethodReport.paymentMethod)
            : VOLUME_OVERALL_TITLE;

        let conversionWorksheet: Excel.Worksheet =
          workbook.getWorksheet(`Conversion - ${conversionTitle}`.substring(0, 31));

        if (!conversionWorksheet) {
          conversionWorksheet = workbook.addWorksheet(`Conversion - ${conversionTitle}`);
        }

        let paymentMethodFieldsMapping: ConversionReportFieldsEnum[] =
          PaymentMethodFieldsMapping.get(paymentMethodReport.paymentMethod);

        if (!paymentMethodFieldsMapping) {
          paymentMethodFieldsMapping = DefaultPaymentMethodFieldsMapping;
        }

        this.setConversionReportHeader(
          conversionWorksheet,
          `Conversion ${conversionReport.reportDate} - ${capitalize(paymentType)}`,
          paymentMethodFieldsMapping,
          paymentType,
        );

        this.writeConversionReportData(
          conversionWorksheet,
          paymentMethodReport,
          paymentMethodReport.paymentMethod ? paymentMethodReport.paymentMethod : VOLUME_OVERALL_TITLE,
          paymentMethodFieldsMapping,
          paymentType,
        );

        this.setRowFontBold(conversionWorksheet.lastRow);
        this.setRowFillColor(conversionWorksheet.lastRow);

        paymentMethodReport.topMerchantsReports[paymentType].forEach(
          (topMerchantReport: ConversionTopMerchantReportDto) => {
            this.writeConversionReportData(
              conversionWorksheet,
              topMerchantReport,
              topMerchantReport.merchantName,
              paymentMethodFieldsMapping,
              paymentType,
            );
          });

        this.addEmptyRows(conversionWorksheet, 1);

        if (!AllowedPaymentMethodsForCharts.includes(paymentMethodReport.paymentMethod)) {
          continue;
        }

        const paymentMethodChartReports: ChartsCountryPaymentMethodReportDto[] =
          volumeReport.chartsReport.chartCountriesReports.map(
            (searchCountryReport: ChartsCountryReportDto) => {
              return searchCountryReport.paymentMethodsReports.find(
                (searchPaymentMethodReport: ChartsCountryPaymentMethodReportDto) =>
                  searchPaymentMethodReport.paymentMethod === paymentMethodReport.paymentMethod);
            });

        const paymentMethodChartReport: ChartsCountryPaymentMethodReportDto =
          paymentMethodChartReports.find((searchEntry: ChartsCountryPaymentMethodReportDto) => !!searchEntry);

        const paymentMethodChartReportsPrevYear: ChartsCountryPaymentMethodReportDto[] =
          volumeReport.chartsReportPrevYear?.chartCountriesReports?.map(
            (searchCountryReport: ChartsCountryReportDto) => {
              return searchCountryReport.paymentMethodsReports.find(
                (searchPaymentMethodReport: ChartsCountryPaymentMethodReportDto) =>
                  searchPaymentMethodReport.paymentMethod === paymentMethodReport.paymentMethod);
            }) || [];

        const paymentMethodChartReportPrevYear: ChartsCountryPaymentMethodReportDto =
          paymentMethodChartReportsPrevYear.find((searchEntry: ChartsCountryPaymentMethodReportDto) => !!searchEntry);

        if (paymentType === PaymentTypesEnum.create) {
          await this.setChartsReportDataByPaymentMethod(
            paymentMethodChartReport,
            paymentMethodChartReportPrevYear,
            conversionWorksheet,
            workbook,
            volumeReport,
          );
        }
      }
    }


  }

  private async setConversionFormReportData(
    conversionFormReport: ConversionFormReportDto,
    volumeReport: VolumeReportDto,
    workbook: Excel.Workbook,
  ): Promise<void> {
    if (!conversionFormReport) {
      return;
    }

    for (const paymentMethodFormReport of conversionFormReport.paymentMethodsFormReports) {
      const conversionTitle: string =
        paymentMethodFormReport.paymentMethod
          ? PaymentMethodsNames.get(paymentMethodFormReport.paymentMethod)
          : VOLUME_OVERALL_TITLE;
      const formWorksheet: Excel.Worksheet = workbook.addWorksheet(`Form - ${conversionTitle}`);

      let paymentMethodFormFieldsMapping: any[] =
        PaymentMethodFormFieldsMapping.get(paymentMethodFormReport.paymentMethod);
      if (!paymentMethodFormFieldsMapping) {
        continue;
      }

      this.setConversionFormReportHeader(
        formWorksheet,
        `Form ${conversionFormReport.reportDate} - ${conversionTitle}`,
        paymentMethodFormFieldsMapping,
        paymentMethodFormReport.forms.map((form: ConversionPaymentMethodFormDto) => `% ${form.name}`),
      );

      paymentMethodFormFieldsMapping = [
        ...paymentMethodFormReport.forms.map((form: ConversionPaymentMethodFormDto) => form.name),
        ...paymentMethodFormFieldsMapping,
      ];

      this.writeConversionFormReportData(
        formWorksheet,
        paymentMethodFormReport,
        paymentMethodFormReport.paymentMethod ? paymentMethodFormReport.paymentMethod : VOLUME_OVERALL_TITLE,
        paymentMethodFormFieldsMapping,
      );

      this.setRowFontBold(formWorksheet.lastRow);
      this.setRowFillColor(formWorksheet.lastRow);

      this.addEmptyRows(formWorksheet, 1);

      await this.setChartsFormReportDataByPaymentMethod(
        paymentMethodFormReport,
        formWorksheet,
        workbook,
        volumeReport,
      );
    }
  }

  private writeReportData(
    worksheet: Excel.Worksheet,
    report: StateReportDto,
    approvedReport: StateReportDto,
    inProcessReport: StateReportDto,
    rejectedReport: StateReportDto,
    reportTitle: string,
    isMerchantsReport: boolean = false,
  ): void {
    const row: any[] = [
      reportTitle,
      report.transactionsCount,
      report.transactionsPercent,
      approvedReport.transactionsCount,
      approvedReport.transactionsPercent,
      inProcessReport.transactionsCount,
      inProcessReport.transactionsPercent,
      rejectedReport.transactionsCount,
      rejectedReport.transactionsPercent,
      report.volumeTotal,
      report.volumePercent,
      approvedReport.volumeTotal,
      approvedReport.volumePercent,
      inProcessReport.volumeTotal,
      inProcessReport.volumePercent,
      rejectedReport.volumeTotal,
      rejectedReport.volumePercent,
      report.averageTicketTotal,
      approvedReport.averageTicketTotal,
      inProcessReport.averageTicketTotal,
      rejectedReport.averageTicketTotal,
      report.transactionsCountTrendPercent,
    ];

    if (isMerchantsReport) {
      row.push(report.businessesCount ? report.businessesCount : report.activeMerchants.length);
    }

    worksheet.addRow(row);
    worksheet.getColumn(2).numFmt = '#0';
    worksheet.getColumn(3).numFmt = '#,##0.00';
    worksheet.getColumn(4).numFmt = '#0';
    worksheet.getColumn(5).numFmt = '#,##0.00';
    worksheet.getColumn(6).numFmt = '#0';
    worksheet.getColumn(7).numFmt = '#,##0.00';
    worksheet.getColumn(8).numFmt = '#0';
    worksheet.getColumn(9).numFmt = '#,##0.00';
    worksheet.getColumn(10).numFmt = '#,##0.00';
    worksheet.getColumn(11).numFmt = '#,##0.00';
    worksheet.getColumn(12).numFmt = '#,##0.00';
    worksheet.getColumn(13).numFmt = '#,##0.00';
    worksheet.getColumn(14).numFmt = '#,##0.00';
    worksheet.getColumn(15).numFmt = '#,##0.00';
    worksheet.getColumn(16).numFmt = '#,##0.00';
    worksheet.getColumn(17).numFmt = '#,##0.00';
    worksheet.getColumn(18).numFmt = '#,##0.00';
    worksheet.getColumn(19).numFmt = '#,##0.00';
    worksheet.getColumn(20).numFmt = '#0';
  }

  private writeDevicesData(
    worksheet: Excel.Worksheet,
    report: StateReportDto,
    reportTitle: string,
  ): void {
    const row: any[] = [
      reportTitle,
      report.transactionsCount,
      report.transactionsPercent,
    ];

    worksheet.addRow(row);
    worksheet.getColumn(2).numFmt = '#0';
    worksheet.getColumn(3).numFmt = '#,##0.00';
  }

  private writeResponseTimeData(
    worksheet: Excel.Worksheet,
    report: ResponseTimeStateDto,
    reportTitle: string,
  ): void {
    const row: any[] = [
      reportTitle,
      report.paymentCreate,
      report.shippingGoods,
      report.refund,
      report.cancel,
      report.oauthToken,
    ];

    worksheet.addRow(row);
    worksheet.getColumn(2).numFmt = '#,##0.00';
    worksheet.getColumn(3).numFmt = '#,##0.00';
    worksheet.getColumn(4).numFmt = '#,##0.00';
    worksheet.getColumn(5).numFmt = '#,##0.00';
    worksheet.getColumn(6).numFmt = '#,##0.00';
  }

  private writeConversionReportData(
    worksheet: Excel.Worksheet,
    conversionStateReport: ConversionStateReportDto,
    conversionTitle: string,
    fields: ConversionReportFieldsEnum[],
    paymentType: string,
  ): void {
    const preparedRows: any[] = fields.map((field: ConversionReportFieldsEnum, index: number) => {
      if (paymentType === PaymentTypesEnum.submit && (field === ConversionReportFieldsEnum.NewPaymentCount ||
        field === ConversionReportFieldsEnum.NewPaymentPercent)) {
        return REPORT_DISABLED_TEXT;
      }

      return conversionStateReport[field];
    });

    const row: any[] = [
      conversionTitle,
      ...preparedRows,
    ];

    worksheet.addRow(row);
    fields.forEach((field: ConversionReportFieldsEnum, index: number) => {
      worksheet.getColumn(index + 2).numFmt = field.match(/Count/) ? '#0' : '#,##0.00';
    });

    worksheet.eachRow((sheetRow) => {
      sheetRow.eachCell((cell) => {
        if (cell.text === REPORT_DISABLED_TEXT) {
          cell.value = ' ';
          cell.fill = {
            fgColor: { argb: REPORT_DISABLED_COLOR },
            pattern: 'darkVertical',
            type: 'pattern',
          };
        }
      });
    });
  }

  private writeConversionFormReportData(
    worksheet: Excel.Worksheet,
    conversionStateReport: ConversionPaymentMethodFormReportDto,
    conversionTitle: string,
    fields: ConversionFormReportFieldsEnum[],
  ): void {
    const preparedRows: any[] = fields.map((field: ConversionFormReportFieldsEnum | string, index: number) => {
      if (conversionStateReport[field]) {
        return conversionStateReport[field];
      } else if (
        conversionStateReport.forms.findIndex((form: ConversionPaymentMethodFormDto) => form.name === field) !== -1
      ) {
        const foundedForm: ConversionPaymentMethodFormDto =
          conversionStateReport.forms.find((form: ConversionPaymentMethodFormDto) => form.name === field);

        return foundedForm.percent;
      }

      return '';
    });

    const row: any[] = [
      conversionTitle,
      ...preparedRows,
    ];

    worksheet.addRow(row);
    fields.forEach((field: ConversionFormReportFieldsEnum, index: number) => {
      worksheet.getColumn(index + 2).numFmt = field.match(/Count/) ? '#0' : '#,##0.00';
    });
  }

  private setReportHeader(
    worksheet: Excel.Worksheet,
    reportTitle: string,
    extraHeaderTitles: string[] = [],
  ): void {
    const baseHeader: Array<{ header: string; width: number }> = [
      { header: 'Transactions Total', width: DEFAULT_COLUMN_WIDTH },
      { header: '% Transactions', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Approved', width: DEFAULT_COLUMN_WIDTH },
      { header: '% Approval', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Processing', width: DEFAULT_COLUMN_WIDTH },
      { header: '% Processing', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Rejected', width: DEFAULT_COLUMN_WIDTH },
      { header: '% Rejected', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Volume Total', width: DEFAULT_COLUMN_WIDTH },
      { header: '% Volume Total', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Volume Approved', width: DEFAULT_COLUMN_WIDTH },
      { header: '% Volume Approved', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Volume Processing', width: DEFAULT_COLUMN_WIDTH },
      { header: '% Volume Processing', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Volume Rejected', width: DEFAULT_COLUMN_WIDTH },
      { header: '% Volume Rejected', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Avg Ticket Total', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Avg Ticket Approved', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Avg Ticket Processing', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Avg Ticket Rejected', width: DEFAULT_COLUMN_WIDTH },
      { header: '% Trend', width: 10 },
    ];

    const extraHeader: any[] = extraHeaderTitles.map((extraTitle: string) => {
      return { header: extraTitle, width: DEFAULT_COLUMN_WIDTH };
    });

    if (worksheet.lastRow) {
      worksheet.addRow([
        reportTitle,
        ...baseHeader.map((item: any) => item.header),
        ...extraHeader.map((item: any) => item.header),
      ]);
    } else {
      worksheet.columns = [
        { header: reportTitle, width: 30 },
        ...baseHeader,
        ...extraHeader,
      ];
    }

    this.setRowFontBold(worksheet.lastRow);
    this.setRowFillColor(worksheet.lastRow, REPORT_HEADER_COLOR);
  }

  private setDevicesReportHeader(
    worksheet: Excel.Worksheet,
    reportTitle: string,
  ): void {
    const baseHeaderTitles: string[] = ['Transactions Total', '% Transactions'];

    const baseHeader: any[] = baseHeaderTitles.map((headerTitle: string) => {
      return { header: headerTitle, width: 20 };
    });

    if (worksheet.lastRow) {
      worksheet.addRow([reportTitle, ...baseHeaderTitles]);
    } else {
      worksheet.columns = [
        { header: reportTitle, width: 30 },
        ...baseHeader,
      ];
    }

    this.setRowFontBold(worksheet.lastRow);
    this.setRowFillColor(worksheet.lastRow, REPORT_HEADER_COLOR);
  }

  private setResponseTimeReportHeader(
    worksheet: Excel.Worksheet,
    reportTitle: string,
  ): void {
    const baseHeaderTitles: string[] = ['Payment create', 'Shipping goods', 'Refund', 'Cancel', 'OAuth token'];

    const baseHeader: any[] = baseHeaderTitles.map((headerTitle: string) => {
      return { header: headerTitle, width: 20 };
    });

    if (worksheet.lastRow) {
      worksheet.addRow([reportTitle, ...baseHeaderTitles]);
    } else {
      worksheet.columns = [
        { header: reportTitle, width: 30 },
        ...baseHeader,
      ];
    }

    this.setRowFontBold(worksheet.lastRow);
    this.setRowFillColor(worksheet.lastRow, REPORT_HEADER_COLOR);
  }

  private setConversionReportHeader(
    worksheet: Excel.Worksheet,
    reportTitle: string,
    headerFields: ConversionReportFieldsEnum[],
    paymentType: string,
  ): void {
    const baseHeaderTitles: string[] =
      headerFields.map((field: ConversionReportFieldsEnum) => {
        if (paymentType === PaymentTypesEnum.submit) {
          return ' ';
        }

        return ConversionTitleFieldsMapping.get(field);
      });

    const baseHeader: any[] = baseHeaderTitles.map((headerTitle: string) => {
      return { header: headerTitle, width: 23 };
    });

    if (worksheet.lastRow) {
      worksheet.addRow([reportTitle, ...baseHeaderTitles]);
    } else {
      worksheet.columns = [
        { header: reportTitle, width: 30 },
        ...baseHeader,
      ];
    }
    this.setRowFontBold(worksheet.lastRow);
    this.setRowFillColor(worksheet.lastRow, REPORT_HEADER_COLOR);
  }

  private setConversionFormReportHeader(
    worksheet: Excel.Worksheet,
    reportTitle: string,
    headerFields: ConversionFormReportFieldsEnum[],
    extraFields: string[] = [],
  ): void {
    let baseHeaderTitles: string[] =
      headerFields.map((field: ConversionFormReportFieldsEnum) => ConversionFormTitleFieldsMapping.get(field));

    baseHeaderTitles = [
      ...extraFields,
      ...baseHeaderTitles,
    ];

    const baseHeader: any[] = baseHeaderTitles.map((headerTitle: string) => {
      return { header: headerTitle, width: 23 };
    });

    if (worksheet.lastRow) {
      worksheet.addRow([reportTitle, ...baseHeaderTitles]);
    } else {
      worksheet.columns = [
        { header: reportTitle, width: 30 },
        ...baseHeader,
      ];
    }

    this.setRowFontBold(worksheet.lastRow);
    this.setRowFillColor(worksheet.lastRow, REPORT_HEADER_COLOR);
  }

  private setRowFontBold(row: Excel.Row): void {
    row.eachCell((cell: Excel.Cell) => {
      cell.font = { bold: true };
    });
  }

  private setRowFillColor(row: Excel.Row, fillColor: string = REPORT_OVERALL_COLOR): void {
    row.eachCell((cell: Excel.Cell) => {
      cell.fill = {
        fgColor: { argb: fillColor },
        pattern: 'darkVertical',
        type: 'pattern',
      };
    });
  }

  private setCellFillColor(row: Excel.Row, index: number, fillColor: string = REPORT_OVERALL_COLOR): void {
    row.getCell(index).fill = {
      fgColor: { argb: fillColor },
      pattern: 'darkVertical',
      type: 'pattern',
    };
  }

  private addEmptyRows(worksheet: Excel.Worksheet, rowsCount: number): void {
    worksheet.addRows(new Array(rowsCount).fill({ }));
  }

  private formatNumberPercent(percent: number): string {
    return percent.toFixed(2).replace('.', ',');
  }
}
