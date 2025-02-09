import { v4 as uuid } from 'uuid';
import { ObjectType, Field } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Schema, Document } from 'mongoose';

import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';

@ObjectType()
export class BaseClass {
  @Field(() => String)
  @Prop({
    default: uuid,
  })
  public _id?: string;

  public readonly id?: string;
}

export interface WithBusinessProps {
  businessId?: string;
  business?: BusinessModel;
}

export function populateBusinessPlugin<D extends WithBusinessProps & Document<string>>(schema: Schema<D>): void {
  schema.virtual('business', {

    ref: BusinessSchemaName,

    foreignField: '_id',
    justOne: true,
    localField: 'businessId',
  });
}

export function populateAppointmentPlugin(schema: Schema): void {
  schema.virtual('appointment', {
    ref: 'Appointment',

    foreignField: '_id',
    justOne: true,
    localField: 'appointmentId',
  });
}
