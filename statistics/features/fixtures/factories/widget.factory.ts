import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { WidgetModel } from '../../../src/statistics';
import { DashboardFactory } from './dashboard.factory';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultWidgetFactory: any = (): WidgetModel => {
  seq.next();

  return ({
    _id: uuid.v4(),
    dashboard: DashboardFactory({}),
    widgetSettings: [],
  } as any);
};

export const WidgetFactory: any = partialFactory(defaultWidgetFactory);
