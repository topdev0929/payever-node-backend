import { Schema, Document } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field as GQLField } from '@nestjs/graphql';
import { BaseClass } from '../../common';

@ObjectType()
@SchemaDecorator({
  timestamps: true,
})
export class RangeAvailability {
  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    index: true,
  })
  public from: string;

  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public to: string;
}

export interface RangeAvailabilityDocument extends Document<string>, RangeAvailability {

}

export const RangeAvailabilitySchema: Schema<RangeAvailabilityDocument> = 
SchemaFactory.createForClass(RangeAvailability);
