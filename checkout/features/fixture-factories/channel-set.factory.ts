import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { ChannelSetInterface } from '../../src/channel-set/interfaces';

type ChannelSetType = ChannelSetInterface & { _id: string };

const LocalFactory: DefaultFactory<ChannelSetType> = (): ChannelSetType => {
  return {
    _id: uuid.v4(),
    active: true,
    checkout: uuid.v4(),
    type: `channel-set-type`,
  };
};

export class ChannelSetFactory {
  public static create: PartialFactory<ChannelSetType> = partialFactory<ChannelSetType>(LocalFactory);
}
