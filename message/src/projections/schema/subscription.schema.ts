import { Schema, Document } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';

import { IntegrationSchemaName } from './integration.schema';

@SchemaDecorator({
  timestamps: true,
})
export class Subscription {
  @Prop()
  public _id: string;

  @Prop()
  public business: string;

  @Prop({
    ref: IntegrationSchemaName,
  })
  public integration: string;

  @Prop({
    default: false,
  })
  public enabled: boolean;

  @Prop({
    default: false,
  })
  public installed: boolean;

  @Prop({
    type: Schema.Types.Mixed,
  })
  public options: any;
}

export interface SubscriptionDocument extends Subscription, Document<string> {
  _id: string;
}

export const SubscriptionSchema: Schema = SchemaFactory.createForClass(Subscription);

export const SubscriptionSchemaName: string = Subscription.name;
