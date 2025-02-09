import { Schema, Document } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field as GQLField } from '@nestjs/graphql';
import { BaseClass, idPlugin } from '../../common';
import { AppointmentTypesEnum, AppointmentDurationUnitsEnum } from '../enums';

@ObjectType()
@SchemaDecorator({
  timestamps: true,
})
export class AppointmentType extends BaseClass {
  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    index: true,
  })
  public businessId?: string;

  @GQLField(() => Number, {
    nullable: true,
  })
  @Prop({
    required: false,
    type: Number,
  })
  public dateRange?: number;

  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    required: false,
    type: String,
  })
  public description?: string;

  @GQLField(() => Number, {
    nullable: true,
  })
  @Prop({
    type: Number,
  })
  public duration: number;

  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public eventLink: string;

  @GQLField(() => Boolean, {
    nullable: true,
  })
  @Prop({
    type: Boolean,
  })
  public indefinitelyRange: boolean;

  @GQLField(() => Boolean, {
    nullable: true,
  })
  @Prop({
    type: Boolean,
  })
  public isDefault: boolean;

  @GQLField(() => Boolean, {
    nullable: true,
  })
  @Prop({
    type: Boolean,
  })
  public isTimeAfter: boolean;

  @GQLField(() => Boolean, {
    nullable: true,
  })
  @Prop({
    type: Boolean,
  })
  public isTimeBefore: boolean;

  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public name: string;


  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public schedule: string;

  @GQLField(() => Number, {
    nullable: true,
  })
  @Prop({
    type: Number,
  })
  public timeBefore?: number;

  @GQLField(() => Number, {
    nullable: true,
  })
  @Prop({
    type: Number,
  })
  public timeAfter?: number;

  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public type: AppointmentTypesEnum;

  @GQLField(() => String, {
    nullable: true,
  })
  @Prop({
    type: String,
  })
  public unit: AppointmentDurationUnitsEnum;

  @GQLField(() => Number, {
    nullable: true,
  })
  @Prop({
    type: Number,
  })
  public maxInvitees?: number;

}

export interface AppointmentTypeDocument extends Document<string>, AppointmentType {
  _id?: string;
  id?: string;
}

export const AppointmentTypeSchemaName: string = AppointmentType.name;
export const AppointmentTypeSchema: Schema<AppointmentTypeDocument> = SchemaFactory.createForClass(AppointmentType);

AppointmentTypeSchema.plugin(idPlugin);
