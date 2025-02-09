import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    date: new Date(),
    type: 'now',
  });
};

export class ScheduleFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
