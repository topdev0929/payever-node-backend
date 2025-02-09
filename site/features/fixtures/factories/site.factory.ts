import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { SiteDocument } from '../../../src/sites/schemas';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    businessId: uuid.v4(),
    channelSet: uuid.v4(),
    isDefault: false,
    name: `Site ${seq.current}`,
    picture: `image_${seq.current}`,
    themes: [],
  });
};

export class SiteFactory {
  public static create: PartialFactory<SiteDocument> = partialFactory<SiteDocument>(defaultFactory);
}
