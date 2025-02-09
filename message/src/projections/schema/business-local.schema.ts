import { v4 as uuid } from 'uuid';
import { BusinessInterface, BusinessModel } from '@pe/business-kit';
import { Schema, Document } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';

@SchemaDecorator()
export class BusinessLocal implements BusinessInterface {
  @Prop({
    default: uuid,
  })
  public _id: string;

  @Prop()
  public enabled: string;

  @Prop()
  public logo?: string;

  @Prop()
  public name: string;

  @Prop()
  public owner?: string;

  @Prop()
  public userAccountId?: string;

  @Prop()
  public hasMessageApp?: boolean;
}

export interface BusinessLocalDocument extends BusinessLocal, BusinessModel, Document {
  _id: string;
}

export const BusinessLocalSchema: Schema<BusinessLocalDocument> = SchemaFactory.createForClass(BusinessLocal);
