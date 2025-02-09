import {
  partialFactory,
  SequenceGenerator,
  PartialFactory,
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultCampaignFactory: DefaultFactory<any> = (): any => {
  seq.next();

  return ({
    _id: v4(),
    businessId: v4(),
    channelSet: v4(),
    createdAt: seq.currentDate.toISOString(),
    name: `campaign ${seq.current}`,
    updatedAt: seq.currentDate.toISOString(),
  });
};

export const campaignFactory: PartialFactory<any> = partialFactory<any>(defaultCampaignFactory);
