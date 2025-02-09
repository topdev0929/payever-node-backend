import { Schema, Types, Document, VirtualType } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import { ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';
import { BusinessSchemaName } from '@pe/business-kit';

import { SiteAccessConfig, SiteAccessConfigDocument } from './site-access-config.schema';
import type { BusinessModel, DomainModel } from '../models';

@SchemaDecorator({
  timestamps: { },
  toJSON: { virtuals: true },
  toObject: {virtuals: true},
})
export class Site {
  @Prop({ default: uuid })
  public _id?: string;

  @Prop({ type: [Schema.Types.String], required: false, ref: SiteAccessConfig.name})
  public accessConfig: string[];

  @Prop({ type: Schema.Types.String, required: true })
  public businessId: string;

  @Prop({ type: Schema.Types.String, required: true })
  public channelSet: string;

  @Prop({ type: [Schema.Types.String], required: false, ref: 'Domain'})
  public domain: string[];

  @Prop({ default: false })
  public isDefault: boolean;

  @Prop()
  public name: string;

  @Prop({ required: false })
  public picture?: string;
}

export interface SiteDocument extends Site, Document<string> {
  readonly id: string;
  readonly business?: BusinessModel;
  readonly accessConfigDocument?: Types.DocumentArray<SiteAccessConfigDocument>;
  readonly channelSetDocument?: ChannelSetModel;
  readonly domainDocument?: Types.DocumentArray<DomainModel>;
}

export const SiteSchema: Schema = SchemaFactory.createForClass(Site);
SiteSchema
  .index({ business: 1 })
  .index({ business: 1, isDefault: 1 })
  .index({ business: 1, name: 1 })
  .index({ name: 'text' })
;

SiteSchema.virtual('id').get(function (): VirtualType {
  return this._id;
});

SiteSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});

SiteSchema.virtual('accessConfigDocument', {
  foreignField: '_id',
  localField: 'accessConfig',
  ref: SiteAccessConfig.name,
});

SiteSchema.virtual('channelSetDocument', {
  foreignField: '_id',
  localField: 'channelSet',
  justOne: true,
  ref: ChannelSetSchemaName,
});

SiteSchema.virtual('domainDocument', {
  foreignField: '_id',
  localField: 'domain',
  ref: 'Domain',
});

export const SiteSchemaName: string = Site.name;
