import { PaymentOptionsEnum, WidgetTypesEnum } from 'src/finance-express/enums';

export interface CalculateRatesInterface {
  amount: number;
  paymentOption: PaymentOptionsEnum;
  widgetId: string;
  widgetType?: WidgetTypesEnum;
  connectionId?: string;
  checkoutId?: string;
  code?: string;
  reference?: string;
  widgetPlaced?: string;
  downPayment?: number;

  [ key: string ]: any;
}
