import { ThirdPartyPaymentItemSubmitInterface } from './third-party-payment-item-submit.interface';
import { CompanyTypeEnum } from '../enum';

export interface ThirdPartyPaymentSubmitInterface {
  payment: {
    amount: number;
    address: {
      addressLine2: string;
      city: string;
      country: string;
      firstName: string;
      lastName: string;
      street: string;
      streetName: string;
      streetNumber: string;
      salutation: string;
      zipCode: string;
      email: string;
      phone: string;
      region: string;
    };
    apiCallId?: string;
    businessId?: string;
    businessName?: string;
    channel: string;
    channelType?: string;
    channelSource?: string;
    pluginVersion?: string;
    channelSetId?: string;
    currency: string;
    customerEmail: string;
    customerName: string;
    customerType?: string;
    reference: string;
    deliveryFee: number;
    total: number;
    flowId?: string;
    orderId?: string;
    locale?: string;
    shippingAddress?: {
      addressLine2: string;
      city: string;
      country: string;
      firstName: string;
      lastName: string;
      street: string;
      streetName: string;
      streetNumber: string;
      salutation: string;
      zipCode: string;
      region: string;
    };
    company?: {
      type?: CompanyTypeEnum;
      name?: string;
      registrationNumber?: string;
      registrationLocation?: string;
      taxId?: string;
      homepage?: string;
      externalId?: string;
    };
    shippingOption?: {
      name?: string;
      carrier?: string;
      category?: string;
      price?: number;
      taxRate?: number;
      taxAmount?: number;
      details?: {
        timeslot?: Date;
        pickupLocation?: {
          id?: string;
          name?: string;
          address?: {
            addressLine2?: string;
            city?: string;
            country?: string;
            firstName?: string;
            lastName?: string;
            street?: string;
            streetName?: string;
            streetNumber?: string;
            salutation?: string;
            zipCode?: string;
            email?: string;
            phone?: string;
            region?: string;
          };
        };
      };
    };
  };
  paymentDetails: object;
  paymentItems: ThirdPartyPaymentItemSubmitInterface[];
  clientIp?: string;
  userAgent?: string;
  forceRedirect?: string;
  skipHandlePaymentFee?: boolean;
  redirectUrlExpiresAt?: Date;
  autoCaptureEnabled?: boolean;
  autoCaptureDate?: Date;
}
