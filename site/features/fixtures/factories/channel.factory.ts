import * as uuid from 'uuid';
import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';


const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    id: uuid.v4(),
    type: 'site',
    channelSets: [],
    customPolicy: false,
    enabledByDefault: false,
  });
};

export class ChannelFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
