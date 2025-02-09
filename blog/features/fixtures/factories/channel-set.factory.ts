import * as uuid from 'uuid';
import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { ChannelSetModel } from '@pe/channels-sdk';
import { Populable } from '../../../src/dev-kit-extras/population';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    id: uuid.v4(),
    channel: uuid.v4(),
  });
};

export class ChannelSetFactory {
  public static create: PartialFactory<Populable<ChannelSetModel>> = partialFactory<Populable<ChannelSetModel>>(defaultFactory);
}
