import { DeviceEnum, BrowserEnum, FormActionEnum, FormStatusEnum } from '../';

export interface CheckoutFormMetricsInterface {
  formActions: Array<{
    form: string;
    field: string;
    action: FormActionEnum;
    validationTriggered: boolean;
    validationError: string;
  }>;
  forms: Array<{
    name: string;
    status: FormStatusEnum;
  }>;
  paymentFlowId: string;
  businessId?: string;
  apiCallId?: string;
  newPaymentId?: string;
  successPaymentId?: string;
  device?: DeviceEnum;
  browser?: BrowserEnum;
  browserVersion?: string;
  javascriptEnabled?: boolean;
  cookiesEnabled?: boolean;
  platform?: string;
  screenColorDepth?: string;
  screenHeight?: string;
  screenWidth?: string;
  timeZone?: string;
  userAgent?: string;
  acceptHeader?: string;
  language?: string;
  consoleErrors?: string[];

  paymentMethod?: string;
  customMetrics?: [string];

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
