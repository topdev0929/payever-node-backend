import { IsArray } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ChartsCountryReportDto } from './charts-country-report.dto';
import { StateReportDto } from '../state-report.dto';

@Exclude()
export class ChartsReportDto extends StateReportDto {
  @IsArray()
  @Expose()
  public chartCountriesReports: ChartsCountryReportDto[] = [];

  constructor() {
    super();
  }
}
