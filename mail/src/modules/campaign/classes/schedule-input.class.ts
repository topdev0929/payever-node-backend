import { Field, ObjectType } from 'type-graphql';
import { ScheduleTypeEnum } from '../enums';
import { ScheduleClass } from './schedule.class';
import { ScheduleIntervalClass } from './schedule-interval.class';
import { ScheduleRecurringClass } from './schedule-recurring.class';

@ObjectType()
export class ScheduleInputClass implements Partial<ScheduleClass> {
  @Field({ nullable: true })
  public date: Date;

  @Field({ nullable: true })
  public interval: ScheduleIntervalClass;

  @Field({ nullable: true })
  public recurring: ScheduleRecurringClass;

  @Field({ nullable: false })
  public type: ScheduleTypeEnum;
}
