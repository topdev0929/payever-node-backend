import {
  ChannelsReportDto,
  ChartsReportDto,
  DevicesReportDto,
  MerchantsReportDto,
  ResponseTimeReportDto,
  TransactionsReportDto,
} from '../dto/volume-report';
import { ConversionReportDto } from '../dto/volume-report/conversion-report/conversion-report.dto';

export type ReportDataType =
  TransactionsReportDto
  | ChartsReportDto
  | MerchantsReportDto
  | ChannelsReportDto
  | DevicesReportDto
  | ResponseTimeReportDto
  | ConversionReportDto;

export interface ReportInterface {
  type: string;
  data: ReportDataType;
  from: Date;
  to: Date;
}
