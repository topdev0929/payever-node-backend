import { SettlementFormatTypeEnum } from '../../../enum';

export const SettlementReportContentTypeMapping: Map<SettlementFormatTypeEnum, string> =
  new Map<SettlementFormatTypeEnum, string>(
  [
    [SettlementFormatTypeEnum.csv, 'text/csv'],
    [SettlementFormatTypeEnum.pdf, 'application/pdf'],
    [SettlementFormatTypeEnum.xlsx, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ],
);
