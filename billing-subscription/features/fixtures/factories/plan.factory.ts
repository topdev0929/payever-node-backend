import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { BillingIntervalsEnum, PlanTypeEnum } from '../../../src/subscriptions/enums';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    billingPeriod: seq.current,
    businessId: uuid.v4(),
    connection: uuid.v4(),
    interval: BillingIntervalsEnum.MONTH,
    planType: PlanTypeEnum.fixed,
    product: uuid.v4(),
  });
};

export class PlanFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
