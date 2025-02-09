import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    enabled: true,
    legacyId: 20,
    type: 'marketing',
  });
};

export class ChannelFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
