import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { StateReportDto } from '../state-report.dto';

@Exclude()
export class BrowserTransactionsCountDto extends StateReportDto {
  @IsString()
  @Expose()
  public browser: string;
}
