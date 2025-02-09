import { Schema, Document } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import { ApplicationAccessInterface, ApplicationAccessStatusEnum } from '@pe/nest-kit';

@SchemaDecorator({
  _id: false,
})
export class ApplicationAccess implements ApplicationAccessInterface {
  @Prop({ required: true })
  public type: string;

  @Prop({ required: false })
  public applicationId: string;

  @Prop({ required: true, index: true })
  public businessId: string;

  @Prop({
    enum: Object.values(ApplicationAccessStatusEnum),
    index: true,
    required: true,
    type: String,
  })
  public status: ApplicationAccessStatusEnum;
}

export interface ApplicationAccessDocument extends ApplicationAccess, Document<string> { }

export const ApplicationAccessSchema: Schema = SchemaFactory.createForClass(ApplicationAccess);
