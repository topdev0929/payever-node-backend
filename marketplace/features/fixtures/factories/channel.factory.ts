import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { ChannelsEnum } from '../../../src/marketplace/enums';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    type: ChannelsEnum.Marketplace,
  });
};

export class ChannelFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
