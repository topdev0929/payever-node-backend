import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { DurationTypeEnum, DurationUnitEnum, ScheduleInterface, TaskTypeEnum } from '../../src/scheduler';

const LocalFactory: DefaultFactory<ScheduleInterface> = (): ScheduleInterface => {
  return {
    _id: uuid.v4(),
    businessId: uuid.v4(),
    task: TaskTypeEnum.paymentLinkReminder,
    duration: {
      type: DurationTypeEnum.every,
      unit: DurationUnitEnum.day,
      period: 5,
    },
    enabled: true,
  };
};

export class ScheduleFactory {
  public static create: PartialFactory<ScheduleInterface> = partialFactory<ScheduleInterface>(LocalFactory);
}
