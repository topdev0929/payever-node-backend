import { Document } from 'mongoose';
import { EmployeeActivityHistoryTypeEnum } from '../enum';

export interface EmployeeActivityHistoryInterface {
  businessId: string;
  documentId: string;
  field: EmployeeActivityHistoryTypeEnum;
  value: any;
  by?: string;
}

export interface EmployeeActivityHistory extends EmployeeActivityHistoryInterface, Document<string> {
  id: string;
}
