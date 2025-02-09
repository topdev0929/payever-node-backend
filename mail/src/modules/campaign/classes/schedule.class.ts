import { Field, ObjectType } from 'type-graphql';
import { ScheduleInterface } from '../interfaces';
import { ScheduleTypeEnum } from '../enums';
import { ScheduleIntervalClass } from './schedule-interval.class';
import { ScheduleRecurringClass } from './schedule-recurring.class';

@ObjectType()
export class ScheduleClass implements ScheduleInterface {
  @Field()
  public id: string;

  @Field()
  public campaign: string;

  @Field({ nullable: true })
  public date: Date;

  @Field({ nullable: true })
  public interval: ScheduleIntervalClass;

  @Field({ nullable: true })
  public recurring: ScheduleRecurringClass;

  @Field({ nullable: false })
  public type: ScheduleTypeEnum;
}



