import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ScheduleRecurringClass {
  @Field()
  public fulfill: number;

  @Field()
  public target: number;
}


