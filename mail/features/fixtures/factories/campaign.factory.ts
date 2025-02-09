import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    date: new Date(),
    status: 'new',
  });
};

export class CampaignFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
