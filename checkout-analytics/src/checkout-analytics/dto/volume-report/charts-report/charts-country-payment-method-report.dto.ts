import { IsString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { StateReportDto } from '../state-report.dto';
import { PaymentMethodsEnum } from '../../../enums';
import { ChartsTotalVolumeDto } from './charts-total-volume.dto';

@Exclude()
export class ChartsCountryPaymentMethodReportDto extends StateReportDto {
  @IsString()
  @Expose()
  public paymentMethod: PaymentMethodsEnum;

  @Type(() => ChartsTotalVolumeDto)
  @Expose()
  public chartsTotalVolume: ChartsTotalVolumeDto[] = [];

  @Type(() => ChartsTotalVolumeDto)
  @Expose()
  public chartsApprovedTotalVolume: ChartsTotalVolumeDto[] = [];

  constructor(paymentMethod: PaymentMethodsEnum) {
    super();

    this.paymentMethod = paymentMethod;
  }
}
