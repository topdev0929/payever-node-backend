import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { BillingIntervalsEnum } from '../../../src/subscriptions/enums';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    billingPeriod: seq.current,
    businessId: uuid.v4(),
    integrationName: `integration_${seq.current}`,
    isEnabled: false,
    name: `connection_name_${seq.current}`,
  });
};

export class ConnectionFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
