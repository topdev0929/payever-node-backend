import { Schema, Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import { UserTokenInterface } from '@pe/nest-kit';

import { ProcessingStatus } from '../enums';
import { SetupMessageInterface } from '../interfaces/incoming';
import { ResultDataInterface } from '../interfaces';
import { BulkImport } from './bulk-import.schema';

@SchemaDecorator({
  timestamps: { },
})
export class Task {
  @Prop({ default: uuid })
  public _id: string;

  @Prop({
    default: ProcessingStatus.Created,
    enum: Object.values(ProcessingStatus),
    required: true,
    type: String,
  })
  public status: ProcessingStatus;

  @Prop({ required: false })
  public token: string;

  @Prop({
    index: true,
    required: true,
    type: Schema.Types.Mixed,
  })
  public user: UserTokenInterface;

  @Prop({ required: true }) //  or false
  public userAgent: string;

  @Prop({ ref: BulkImport.name, required: true })
  public bulkImportId: string;

  @Prop({ type: Schema.Types.Mixed, default: [] })
  public doneProcess: string[];

  @Prop({ required: true })
  public businessId: string;

  @Prop({ required: false, type: Schema.Types.Mixed })
  public error?: any;

  @Prop({ required: true, type: Object, default: { }})
  public incomingData: SetupMessageInterface;

  @Prop({ required: false, type: Object, default: { }})
  public resultData?: {
    [key: string]: ResultDataInterface;
  };
}

export interface TaskDocument extends Task, Document<string> {
  _id: string;
}

export const TaskSchema: Schema<TaskDocument> = SchemaFactory.createForClass(Task);
