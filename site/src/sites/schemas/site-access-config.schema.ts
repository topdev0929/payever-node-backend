
import { Schema, Document, LeanDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import type { SiteDocument } from './site.schema';

@SchemaDecorator({
  timestamps: { },
})
export class SiteAccessConfig {
  @Prop({ default: uuid })
  public _id?: string;

  @Prop({ unique: true })
  public internalDomain: string;

  @Prop({ required: false })
  public internalDomainPattern?: string;

  @Prop({ default: false })
  public isLive: boolean;

  @Prop({ default: false })
  public isLocked: boolean;

  @Prop({ default: false })
  public isPrivate: boolean;

  @Prop({ required: false })
  public ownDomain?: string;

  @Prop({ required: false })
  public privateMessage?: string;

  @Prop({ required: false })
  public privatePassword?: string;

  @Prop({ default: false, required: false })
  public approvedCustomersAllowed?: boolean;

  @Prop({ type: Schema.Types.String, required: true, ref: 'Site' })
  public site: string;

  @Prop()
  public socialImage: string;

  @Prop()
  public version?: string;
}

export interface SiteAccessConfigDocument extends SiteAccessConfig, Document<string> {
  readonly siteDocument?: SiteDocument;
}

export const SiteAccessConfigSchema: Schema<SiteAccessConfigDocument> = SchemaFactory.createForClass(SiteAccessConfig);

SiteAccessConfigSchema.virtual('siteDocument', {
  foreignField: '_id',
  justOne: true,
  localField: 'site',
  ref: 'Site',
});

SiteAccessConfigSchema.methods.toJSON = function(): Omit<LeanDocument<SiteAccessConfigDocument>, 'privatePassword'> {
  const json: LeanDocument<SiteAccessConfigDocument> = Object.assign({ }, this.toObject());
  delete json.privatePassword;
  json.id = json._id;

  return json;
};

export const SiteAccessConfigSchemaName: string = SiteAccessConfig.name;
