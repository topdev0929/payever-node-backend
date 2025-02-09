import * as uuid from 'uuid';
import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    activeSince: new Date(),
    ancestors: [],
    businessId: uuid.v4(),
    channelSets: [],
    name: `Collection  ${seq.current}`,
    slug: `collection_${seq.current}`,
  });
};

export class CollectionFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
