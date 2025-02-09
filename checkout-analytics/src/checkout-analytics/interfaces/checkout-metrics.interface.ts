import { DeviceEnum, BrowserEnum } from '../';

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

  forceRedirect?: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
