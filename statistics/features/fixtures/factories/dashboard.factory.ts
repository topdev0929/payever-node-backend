import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { DashboardModel } from '../../../src/statistics';
import { businessFactory } from './business.factory';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultDashboardFactory: any = (): DashboardModel => {
  seq.next();

  return ({
    _id: uuid.v4(),
    businessId: businessFactory({}),
    name: `Dashboard_${seq.current}`,
    isDefault: true
  } as any);
};

export const DashboardFactory: any = partialFactory(defaultDashboardFactory);
