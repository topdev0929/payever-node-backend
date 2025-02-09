/* eslint-disable max-classes-per-file */
import { Schema, Document } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';

@SchemaDecorator()
export class DisplayOptions {
  @Prop()
  public _id: string;

  @Prop()
  public icon: string;

  @Prop()
  public order?: number;

  @Prop()
  public title: string;
}

export const DisplayOptionsSchema: Schema = SchemaFactory.createForClass(DisplayOptions);

@SchemaDecorator()
export class SettingsOptions {
  @Prop()
  public _id: string;

  @Prop()
  public source: string;
}

export const SettingsOptionsSchema: Schema = SchemaFactory.createForClass(SettingsOptions);

@SchemaDecorator({
  timestamps: true,
})
export class Integration {
  @Prop()
  public _id: string;

  @Prop()
  public autoEnable: boolean;

  @Prop()
  public category: string;

  @Prop({
    type: DisplayOptionsSchema,
  })
  public displayOptions: DisplayOptions;

  @Prop()
  public isVisible?: boolean;

  @Prop({
    required: true,
    unique: true,
  })
  public name: string;

  @Prop({
    type: SettingsOptionsSchema,
  })
  public settingsOptions?: SettingsOptions;
}

export interface IntegrationDocument extends Integration, Document<string> {
  _id: string;
}

export const IntegrationSchema: Schema = SchemaFactory.createForClass(Integration);

export const IntegrationSchemaName: string = Integration.name;
