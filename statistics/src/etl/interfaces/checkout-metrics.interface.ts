import { BrowserEnum, DeviceEnum } from 'src/statistics/enums';

export interface CheckoutMetricsInterface {
  paymentFlowId: string;
  businessId?: string;
  apiCallId?: string;
  newPaymentId?: string;
  successPaymentId?: string;
  device?: DeviceEnum;
  browser?: BrowserEnum;
  consoleErrors?: string[];

  paymentMethod?: string;
  customMetrics?: [string];
}
