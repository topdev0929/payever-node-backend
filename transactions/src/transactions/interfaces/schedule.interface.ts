import { ExportFormatEnum } from '../enum';

export interface ScheduleInterface {
  email: string;
  duration: string;
  lastSent?: Date;
  businessId: string;
  paymentMethod: string;
  enabled: boolean;
  format?: ExportFormatEnum;
}
