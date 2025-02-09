import { ReportCountriesEnum } from '../enums';

export interface reportParamsInterface {
  country?: ReportCountriesEnum;
  dateFrom?: Date;
  dateTo?: Date;
  previousDateFrom?: Date;
  previousDateTo?: Date;
}
