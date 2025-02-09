import { ChannelSetModel } from '@pe/channels-sdk';
import { businessFixture } from './businessFixture';

export class channelSetFixture {
  public static getModel(id: string): ChannelSetModel {
    const model: ChannelSetModel = {
      _id: id,
      id: id,
      save: (): void => { },
    } as ChannelSetModel;
    businessFixture.addStubs(model);
    return model;
  }
}
