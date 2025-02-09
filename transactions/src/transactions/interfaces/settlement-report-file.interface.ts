import { SettlementFormatTypeEnum } from '../enum';

export interface SettlementReportFileInterface {
  _id?: any;
  format: SettlementFormatTypeEnum;
  url: string;
}
