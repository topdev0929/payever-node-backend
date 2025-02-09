import { v4 as uuid } from 'uuid';

import { DocumentDefinition } from 'mongoose';
import { PartialFactory, partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';

import { CheckoutMetricsInterface } from '../../../src/etl/interfaces';
import { BrowserEnum, DeviceEnum } from '../../../src/statistics';

const seq: SequenceGenerator = new SequenceGenerator(0);

const defaultMetricFactory: () => DocumentDefinition<CheckoutMetricsInterface> = () => {
  seq.next();

  return {
    _id: uuid(),
    businessId: uuid(),
    apiCallId: null,
    newPaymentId: null,
    successPaymentId: null,
    paymentMethod: null,
    customMetrics: [],
    paymentFlowId: uuid(),
    browser: BrowserEnum.Safari,
    device: DeviceEnum.mobile,

    createdAt: seq.currentDate,
    updatedAt: seq.currentDate,
  };
};

export const metricFactory: PartialFactory<DocumentDefinition<CheckoutMetricsInterface>> =
  partialFactory(defaultMetricFactory);
