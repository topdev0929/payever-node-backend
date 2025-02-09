import { DisplayModesEnum, SortModesEnum } from '../../enums';
import { BusinessInterface } from '../../../business';
import { AmountInterface } from '../';
import { ChannelSetInterface } from '@pe/channels-sdk';
import { PaymentOptionInterface } from '../payment-option-interface';

export interface WidgetInterface {
  amountLimits: AmountInterface;
  business?: BusinessInterface;
  businessId: string;
  channelSet: ChannelSetInterface;
  checkoutId: string;
  checkoutMode: string;
  checkoutPlacement: DisplayModesEnum;
  isVisible: boolean;
  maxWidth: number;
  minWidth: number;
  payments: PaymentOptionInterface[];
  ratesOrder: SortModesEnum;
  styles: any;
  type: string;

  cancelUrl?: string;
  failureUrl?: string;
  noticeUrl?: string;
  pendingUrl?: string;
  successUrl?: string;
}
