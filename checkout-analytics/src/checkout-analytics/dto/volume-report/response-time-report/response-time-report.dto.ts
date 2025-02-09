import { IsString, IsArray } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { CountryResponseTimeReportDto } from './country-response-time-report.dto';
import { ResponseTimeStateDto } from './response-time-state.dto';

@Exclude()
export class ResponseTimeReportDto extends ResponseTimeStateDto {
  @IsArray()
  @Expose()
  public countriesReports: CountryResponseTimeReportDto[] = [];

  @IsString()
  @Expose()
  public reportDate: string;
}
