import { Schema, Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BusinessInterface } from '@pe/business-kit';

@SchemaDecorator({
  minimize: false,
  timestamps: { },
  toJSON: { virtuals: true },
})
export class BusinessLocal implements BusinessInterface {
  @Prop({ default: uuid })
  public _id: string;

  @Prop()
  public contactEmails: string[];

  @Prop()
  public name: string;

  @Prop()
  public owner: string;
}

export interface BusinessLocalDocument extends BusinessLocal, Document<string> {
  _id: string;
}

export const BusinessLocalSchema: Schema = SchemaFactory.createForClass(BusinessLocal);
