import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { CountryDevicesReportDto } from './country-devices-report.dto';
import { StateReportDto } from '../state-report.dto';
import { BrowserTransactionsCountDto } from './browser-transactions-count.dto';
import { DeviceTransactionsCountDto } from './device-transactions-count.dto';

@Exclude()
export class DevicesReportDto extends StateReportDto {
  @IsArray()
  @Expose()
  public countriesReports: CountryDevicesReportDto[] = [];

  @Expose()
  @Type(() => BrowserTransactionsCountDto)
  public browserTransactionsCount: BrowserTransactionsCountDto[];

  @Expose()
  @Type(() => DeviceTransactionsCountDto)
  public deviceTransactionsCount: DeviceTransactionsCountDto[];

  @IsString()
  @Expose()
  public reportDate: string;

  constructor() {
    super();

    this.browserTransactionsCount = [];
    this.deviceTransactionsCount = [];
  }
}
