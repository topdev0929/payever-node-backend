import * as uuid from 'uuid';

import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { SectionsEnum } from '../../../src/stepper/enums';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    businessId: uuid.v4(),
    isActive: false,
    section: SectionsEnum.Shop,
    step: uuid.v4(),
  });
};

export class BusinessStepFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
