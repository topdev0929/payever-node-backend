/* tslint:disable:file-name-casing */
import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    channel: '7216b901-5036-4d58-9694-534a769c3428',
  });
};

export class ChannelSetFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
