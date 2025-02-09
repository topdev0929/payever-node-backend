import { Exclude, Expose, Type } from 'class-transformer';
import { TransactionsReportDto } from './transactions-report/transactions-report.dto';
import { MerchantsReportDto } from './merchants-report/merchants-report.dto';
import { ChannelsReportDto } from './channels-report/channels-report.dto';
import { ConversionReportDto } from './conversion-report/conversion-report.dto';
import { ConversionFormReportDto } from './conversion-form-report/conversion-form-report.dto';
import { DevicesReportDto } from './devices-report/devices-report.dto';
import { ChartsReportDto } from './charts-report/charts-report.dto';
import { ResponseTimeReportDto } from './response-time-report/response-time-report.dto';

@Exclude()
export class VolumeReportDto {
  @Type(() => TransactionsReportDto)
  @Expose()
  public transactionsReport: TransactionsReportDto;

  @Type(() => ChartsReportDto)
  @Expose()
  public chartsReport: ChartsReportDto;

  @Type(() => ChartsReportDto)
  @Expose()
  public chartsReportPrevYear: ChartsReportDto;

  @Type(() => MerchantsReportDto)
  @Expose()
  public merchantsReport: MerchantsReportDto;

  @Type(() => ChannelsReportDto)
  @Expose()
  public channelsReport: ChannelsReportDto;

  @Type(() => DevicesReportDto)
  @Expose()
  public devicesReport: DevicesReportDto;

  @Type(() => ResponseTimeReportDto)
  @Expose()
  public responseTimeReport: ResponseTimeReportDto;

  @Type(() => ConversionReportDto)
  @Expose()
  public conversionReport: ConversionReportDto;

  @Type(() => ConversionFormReportDto)
  @Expose()
  public conversionFormReport: ConversionFormReportDto;

  @Expose()
  public reportDateFrom: Date;

  @Expose()
  public reportDateTo: Date;

  constructor() {
    this.transactionsReport = new TransactionsReportDto();
    this.merchantsReport = new MerchantsReportDto();
    this.channelsReport = new ChannelsReportDto();
    this.devicesReport = new DevicesReportDto();
    this.conversionReport = new ConversionReportDto();
  }
}
