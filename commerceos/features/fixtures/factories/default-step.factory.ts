import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { SectionsEnum } from '../../../src/stepper/enums';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    action: `action_${seq.current}`,
    allowSkip: true,
    order: seq.current,
    section: SectionsEnum.Shop,
    title: `title_${seq.current}`,
  });
};

export class DefaultStepFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
