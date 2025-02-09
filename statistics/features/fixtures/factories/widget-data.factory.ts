import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { WidgetPropsModel } from '../../../src/statistics/models';

const seq: SequenceGenerator = new SequenceGenerator();

export const defaultWidgetDataFactory: any = (): WidgetPropsModel => {
  seq.next();

  return ({
    _id: uuid.v4(),
  } as any);
};

export const WidgetDataFactory: any = partialFactory(defaultWidgetDataFactory);
