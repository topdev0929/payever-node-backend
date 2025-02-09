import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { ApiCallInterface } from '../../src/payment-notifications/interfaces';

type ApiCallType = ApiCallInterface & { _id: string };

const LocalFactory: DefaultFactory<ApiCallType> = (): ApiCallType => {
  return {
    _id: uuid.v4(),
    cancelUrl: 'https://cancel.url?api_call_id=--CALL-ID--&payment_id=--PAYMENT-ID--',
    customerRedirectUrl: 'https://customer-redirect.url?api_call_id=--CALL-ID--&payment_id=--PAYMENT-ID--',
    failureUrl: 'https://failure.url?api_call_id=--CALL-ID--&payment_id=--PAYMENT-ID--',
    noticeUrl: 'https://notice.url?api_call_id=--CALL-ID--&payment_id=--PAYMENT-ID--',
    pendingUrl: 'https://pending.url?api_call_id=--CALL-ID--&payment_id=--PAYMENT-ID--',
    successUrl: 'https://success.url?api_call_id=--CALL-ID--&payment_id=--PAYMENT-ID--',
  };
};

export class ApiCallFactory {
  public static create: PartialFactory<ApiCallType> =
    partialFactory<ApiCallType>(LocalFactory);
}
