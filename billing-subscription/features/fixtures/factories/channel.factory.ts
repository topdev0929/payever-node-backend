import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return (
    {
      _id: '7216b901-5036-4d58-9694-534a769c3428',
      enabled: true,
      enabledByDefault: false,
      type: 'subscription',
    }
  );
};

export class ChannelFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
