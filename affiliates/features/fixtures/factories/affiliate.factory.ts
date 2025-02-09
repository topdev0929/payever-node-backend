import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    email: `test-affiliate${seq.current}@email.com`,
    firstName: `affiliate ${seq.current}`,
    lastName: `last_name_${seq.current}`,
  });
};

export class AffiliateFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
