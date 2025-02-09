import { BrowserEnum, DeviceEnum } from '../../statistics';
import { PaymentAddressInterface } from './payment-address.interface';
import { PaymentItemInterface } from './payment-item.interface';

export interface PaymentInterface {
  readonly amount: number;
  readonly deliveryFee?: number;
  readonly downPayment?: number;
  readonly total: number;

  readonly businessId?: string;
  readonly businessName?: string;
  readonly businessCreatedAt?: Date;
  readonly channel: string;
  readonly channelSetId?: string;
  readonly currency: string;
  originalId: string;
  readonly paymentMethod: string;
  readonly reference: string;
  readonly specificStatus?: string;
  status?: string;
  readonly browser?: BrowserEnum;
  readonly device?: DeviceEnum;

  readonly customerEmail?: string;
  readonly customerName?: string;

  readonly userId?: string;

  readonly billingAddress?: PaymentAddressInterface;
  readonly shippingAddress?: PaymentAddressInterface;

  readonly items?: PaymentItemInterface[];

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
