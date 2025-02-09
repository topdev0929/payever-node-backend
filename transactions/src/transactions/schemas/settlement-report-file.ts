import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { SettlementFormatTypeEnum } from '../enum';

export const SettlementReportFileSchemaName: string = 'SettlementReportFile';
export const SettlementReportFileSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  format: { type: SettlementFormatTypeEnum, required: true },
  url: { type: String, required: true },
});
