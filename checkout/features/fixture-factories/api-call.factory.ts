import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { ApiCallInterface } from '../../src/common/interfaces';

type ApiCallType = ApiCallInterface & { _id: string };

const LocalFactory: DefaultFactory<ApiCallType> = (): ApiCallType => {
  return {
    _id: uuid.v4(),
    amount: 1000,
    businessId: uuid.v4(),
    channel: 'test_channel',
    channel_set_id: uuid.v4(),
    currency: 'EUR',
    order_id: 'test_order_id',
    payment_method: 'ideal',
  };
};

export class ApiCallFactory {
  public static create: PartialFactory<ApiCallType> = partialFactory<ApiCallType>(LocalFactory);
}
