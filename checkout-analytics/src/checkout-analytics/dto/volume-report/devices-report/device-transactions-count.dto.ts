import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { StateReportDto } from '../state-report.dto';

@Exclude()
export class DeviceTransactionsCountDto extends StateReportDto {
  @IsString()
  @Expose()
  public device: string;
}
