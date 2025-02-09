import { ThirdPartyClientParameters } from './third-party-client-parameters.interface';

export interface TransactionsClientParameters extends ThirdPartyClientParameters {
  businessId: string;
  paymentUuid: string;
}
