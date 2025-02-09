import { ErrorNotificationTypesEnum } from '../enums';

export interface ErrorNotificationInterface {
  readonly businessId: string;
  readonly type: ErrorNotificationTypesEnum;
  readonly errorDetails: any;
  readonly errorDate?: Date;
  readonly emailSent?: boolean;
  readonly lastTimeSent?: Date;
  readonly integration?: string;
}
