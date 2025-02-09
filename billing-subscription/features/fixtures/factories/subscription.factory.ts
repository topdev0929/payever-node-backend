import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    plan: uuid.v4(),
    quantity: seq.current,
    remoteSubscriptionId: uuid.v4(),
  });
};

export class SubscriptionFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
