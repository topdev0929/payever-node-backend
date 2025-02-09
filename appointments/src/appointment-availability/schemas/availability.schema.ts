import { Schema, Document } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field as GQLField } from '@nestjs/graphql';
import { BaseClass, idPlugin } from '../../common';
import { TimeZones } from '../enums';
import { Weekday, WeekdaySchema } from './weekday.schema';

@ObjectType()
@SchemaDecorator({
  timestamps: true,
})
export class AppointmentAvailability extends BaseClass {
  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    index: true,
  })
  public businessId?: string;

  @GQLField(() => Boolean, {
    nullable: true,
  })
  @Prop({
    type: Boolean,
  })
  public isDefault: boolean;

  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public timeZone: TimeZones;


  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public name: string;

  @GQLField(() => [Weekday], {
    nullable: true,
  })
  @Prop({
    type: [WeekdaySchema],
  })
  public  weekDayAvailability: Weekday[];
}

export interface AppointmentAvailabilityDocument extends Document<string>, AppointmentAvailability {
  _id?: string;
  id?: string;
}

export const AppointmentAvailabilitySchemaName: string = AppointmentAvailability.name;
export const AppointmentAvailabilitySchema: Schema<AppointmentAvailabilityDocument> = 
SchemaFactory.createForClass(AppointmentAvailability);

AppointmentAvailabilitySchema.plugin(idPlugin);
