import { ShippingMethodInterface } from './shipping-method.interface';
import { ShippingBoxInterface } from './shipping-box.interface';
import { AddressInterface } from './address.interface';
import { ShippingOriginInterface } from './shipping-origin.interface';
import { ShippingHistoryInterface } from './shipping-history.interface';
import { ShippingProductItemInterface } from './shipping-product-item.interface';
import { BusinessInterface } from '../../business/interfaces';
import { ShippingStatusEnums } from '../enums';

export interface ShippingOrderInterface {
  business?: BusinessInterface;
  businessId: string;
  businessName: string;
  transactionId?: string;
  legalText?: string;
  shipmentNumber?: string;
  trackingUrl?: string;
  trackingId?: string;
  label?: string;
  shippingMethod?: ShippingMethodInterface;
  shippingItems?: ShippingProductItemInterface[];
  shippingBoxes?: ShippingBoxInterface[];
  shippingHistory?: ShippingHistoryInterface[];
  shippingOrigin: ShippingOriginInterface;
  billingAddress?: AddressInterface;
  shippingAddress?: AddressInterface;
  processedAt?: Date;
  shippedAt?: Date | string;
  status?: ShippingStatusEnums;
}
