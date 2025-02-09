import { Schema, Document } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field as GQLField } from '@nestjs/graphql';
import { WeekdayEnum } from '../enums';
import { RangeAvailability, RangeAvailabilitySchema } from './range-availability.schema';

@ObjectType()
@SchemaDecorator({
  timestamps: true,
})
export class Weekday {
  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public name: WeekdayEnum;

  @GQLField(() => Boolean, {
    nullable: true,
  })
  @Prop({
    type: Boolean,
  })
  public isEnabled: boolean;
 
  @GQLField(() => [RangeAvailability], {
    nullable: true,
  })
  @Prop({
    require: false,
    type: [RangeAvailabilitySchema],
  })
  public  ranges?: RangeAvailability[];
}

export interface WeekdayDocument extends Document<string>, Weekday { }

export const WeekdaySchema: Schema<WeekdayDocument> = SchemaFactory.createForClass(Weekday);
