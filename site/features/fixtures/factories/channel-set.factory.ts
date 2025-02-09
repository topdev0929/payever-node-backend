import * as uuid from 'uuid';
import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    id: uuid.v4(),
    channel: uuid.v4(),
  });
};

export class ChannelSetFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
