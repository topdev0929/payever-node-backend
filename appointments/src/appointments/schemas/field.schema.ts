import { Schema, Document } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field as GQLField } from '@nestjs/graphql';
import { BusinessModel } from '@pe/business-kit';

import { idPlugin } from '../../common/schemas/id.plugin';
import { BaseClass, populateBusinessPlugin } from '../../common/schemas/base';

@ObjectType()
@SchemaDecorator()
export class Field extends BaseClass {
  @GQLField(() => String, {
    nullable: true,
  })
  @Prop()
  public businessId?: string;

  @GQLField(() => String, {
    nullable: true,
  })
  @Prop()
  public appointmentId?: string;

  @GQLField(() => String)
  @Prop({
    index: true,
  })
  public title: string;

  @GQLField(() => String)
  @Prop({
    index: true,
  })
  public name: string;

  @GQLField(() => String)
  @Prop()
  public type: string;

  @GQLField(() => Boolean, {
    nullable: true,
  })
  @Prop()
  public filterable?: boolean;

  @GQLField(() => Boolean)
  @Prop()
  public editableByAdmin?: boolean;

  @GQLField(() => Boolean, {
    nullable: true,
  })
  @Prop()
  public showDefault?: boolean;

  @GQLField(() => [String], {
    nullable: true,
  })
  @Prop({
    required: false,
    type: [String],
  })
  public defaultValues?: string[];
}

export interface FieldDocument extends Document<string>, Field {
  id?: string;
  business?: BusinessModel;
}

export const FieldSchemaName: string = 'Field';
export const FieldSchema: Schema<FieldDocument> = SchemaFactory.createForClass(Field);

FieldSchema.plugin(idPlugin);
FieldSchema.plugin(populateBusinessPlugin);
