import { Schema, Document } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field as GQLField } from '@nestjs/graphql';

import { AppointmentField, AppointmentFieldDocument } from './appointment-field.schema';
import { BaseClass } from '../../common/schemas/base';
import { idPlugin } from '../../common/schemas/id.plugin';

@ObjectType()
@SchemaDecorator({
  timestamps: true,
})
export class Appointment extends BaseClass {
  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    index: true,
  })
  public businessId?: string;

  @GQLField(() => [AppointmentField])
  public readonly fields?: AppointmentField[];

  @GQLField(() => Boolean)
  @Prop({
    type: Boolean,
  })
  public allDay: boolean;

  @GQLField(() => Boolean)
  @Prop({
    type: Boolean,
  })
  public repeat: boolean;

  @GQLField(() => String, { nullable: true })
  @Prop({
    required: false,
    type: String,
  })
  public date?: string;

  @GQLField(() => String, { nullable: true })
  @Prop({
    required: false,
    type: String,
  })
  public time?: string;

  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public location?: string;

  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public note?: string;

  @GQLField(() => [String], { nullable: true })
  @Prop({
    default: [],
    required: false,
    type: [String],
  })
  public products?: string[];

  @GQLField(() => [String], { nullable: true })
  @Prop({
    default: [],
    required: false,
    type: [String],
  })
  public contacts?: string[];

  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public appointmentNetwork: string;

  @GQLField(() => Number, {
    nullable: true,
  })
  @Prop({
    type: Number,
  })
  public duration?: number;

  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public measuring?: string;

  @GQLField(() => String, {
    nullable: true,
  }) 
  public applicationScopeElasticId?: string;
  
  @GQLField(() => String, {
    nullable: true,
  }) 
  public businessScopeElasticId?: string;
}

export interface AppointmentDocument extends Document<string>, Appointment {
  _id?: string;
  id?: string;
  readonly fields?: AppointmentFieldDocument[];
  readonly updatedAt?: Date;
  readonly createdAt?: Date;
  readonly appointmentNetwork: string;
  readonly duration?: number;
  readonly measuring?: string;

}

export const AppointmentSchemaName: string = 'Appointment';
export const AppointmentSchema: Schema<AppointmentDocument> = SchemaFactory.createForClass(Appointment);

AppointmentSchema.plugin(idPlugin);

AppointmentSchema.virtual('fields', {
  foreignField: 'appointmentId',
  localField: '_id',
  ref: 'AppointmentField',
});
