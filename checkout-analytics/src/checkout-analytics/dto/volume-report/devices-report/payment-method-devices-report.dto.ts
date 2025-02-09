import { IsString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { StateReportDto } from '../state-report.dto';
import { PaymentMethodsEnum } from '../../../enums';
import { BrowserTransactionsCountDto } from './browser-transactions-count.dto';
import { DeviceTransactionsCountDto } from './device-transactions-count.dto';

@Exclude()
export class PaymentMethodDevicesReportDto extends StateReportDto {
  @IsString()
  @Expose()
  public paymentMethod: PaymentMethodsEnum;

  @Expose()
  @Type(() => BrowserTransactionsCountDto)
  public browserTransactionsCount: BrowserTransactionsCountDto[];

  @Expose()
  @Type(() => DeviceTransactionsCountDto)
  public deviceTransactionsCount: DeviceTransactionsCountDto[];

  constructor(paymentMethod: PaymentMethodsEnum) {
    super();

    this.paymentMethod = paymentMethod;
    this.browserTransactionsCount = [];
    this.deviceTransactionsCount = [];
  }
}
