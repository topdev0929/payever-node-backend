import { Schema, Document } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import { Field, FieldDocument } from './field.schema';
import { idPlugin } from '../../common/schemas/id.plugin';

import { ObjectType, Field as GQLField } from '@nestjs/graphql';
import { BaseClass } from '../../common/schemas/base';

@ObjectType()
@SchemaDecorator()
export class AppointmentField extends BaseClass {
  @GQLField(() => String)
  @Prop({
    index: true,
  })
  public appointmentId: string;

  @GQLField(() => String)
  @Prop()
  public fieldId: string;

  @GQLField(() => Field)
  public readonly field?: Field;

  @GQLField(() => String)
  @Prop({
    index: true,
  })
  public value: string;
}

export interface AppointmentFieldDocument extends Document<string>, AppointmentField {
  id?: string;
  readonly field?: FieldDocument;
}

export const AppointmentFieldSchemaName: string = 'AppointmentField';
export const AppointmentFieldSchema: Schema<AppointmentFieldDocument> = SchemaFactory.createForClass(AppointmentField);

AppointmentFieldSchema.plugin(idPlugin);

AppointmentFieldSchema.virtual('field', {
  foreignField: '_id',
  justOne: true,
  localField: 'fieldId',
  ref: Field.name,
});
