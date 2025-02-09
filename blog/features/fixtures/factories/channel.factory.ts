import * as uuid from 'uuid';
import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { ChannelModel } from '@pe/channels-sdk';


const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (changes: Partial<ChannelModel>): ChannelModel => {
  seq.next();

  return ({
    id: uuid.v4(),
    type: 'blog',
    // channelSets: [],
    customPolicy: false,
    enabledByDefault: false,
    ...changes,
  }) as ChannelModel;
};

export class ChannelFactory {
  public static create: PartialFactory<ChannelModel> = partialFactory<ChannelModel>(defaultFactory);
}
