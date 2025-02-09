import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { BusinessModel } from '../../../src/business/models';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultBusinessFactory: any = (): BusinessModel => {
  seq.next();

  return ({
    integrationSubscriptions: [{
      id: uuid.v4(),
      integration: uuid.v4(),
    }],
    settings: [{
      businessId: uuid.v4(),
    }],
  });
};

export const businessFactory: any = partialFactory(defaultBusinessFactory);
