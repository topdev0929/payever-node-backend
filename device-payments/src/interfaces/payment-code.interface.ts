import { Document } from 'mongoose';
import { CodeStatus, PaymentSource, Salutation, VerificationStep, VerificationType } from '../enum';
import { PaymentCodeCartInterface } from './payment-code-cart.interface';
import { PaymentFlowLogInterface } from './payment-flow-log.interface';

export interface PaymentCode extends Document {
  _id: string;
  flow: {
    id: string;
    amount: number;
    businessId: string;
    channelSetId: string;
    reference: string;
    payment: {
      id: string;
      uuid: string;
      paymentType: string;
    };
    billingAddress: {
      salutation?: Salutation;
      firstName?: string;
      lastName?: string;
      email?: string;
      country?: string;
      city?: string;
      zipCode?: string;
      street?: string;
      phone?: string;
    };
    cart: PaymentCodeCartInterface[];
  };

  checkoutId: string;

  /** @deprecated */
  terminalId: string;

  applicationId: string;
  type: string;
  code: number;
  status: CodeStatus; // Used just to display status to merchant
  log: {
    secondFactor: boolean;
    source: PaymentSource;
    verificationStep: VerificationStep; // used internally to detect which verification step should be taken next
    verificationType: VerificationType;
    paymentFlows: PaymentFlowLogInterface[];
  };
  sellerEmail?: string;
  createdAt: Date;
  updatedAt: Date;
  checkAmount: (amount: number) => Promise<void | never>;
  updateAmount: (amount: number) => Promise<any>;
}
