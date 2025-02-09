import { Field, ObjectType } from 'type-graphql';
import { ScheduleIntervalEnum } from '../enums';

@ObjectType()
export class ScheduleIntervalClass {
  @Field()
  public number: number;

  @Field()
  public type: ScheduleIntervalEnum;
}


