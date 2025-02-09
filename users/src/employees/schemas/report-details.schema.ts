import { Schema, Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Report } from './report.schema';
import { ValidateInstructionResultDataInterface } from '../interfaces';
import { ProcessingStatus } from '../enum/processing-status.enum';
import { Task } from './task.schema';

@SchemaDecorator()
export class ReportDetail {
  @Prop({ default: uuid })
  public _id: string;

  @Prop({
    default: ProcessingStatus.Created,
    enum: Object.values(ProcessingStatus),
    required: true,
    type: String,
  })
  public status: ProcessingStatus;

  @Prop({ ref: Task.name })
  public task: string;

  @Prop({ ref: Report.name })
  public report: string;

  @Prop( { required: false, type: Schema.Types.Mixed, default: { } })
  public resultData?: { [key: string]: ValidateInstructionResultDataInterface };

  @Prop({ required: false, type: Schema.Types.Mixed, default: { } })
  public error?: any;

  @Prop({ required: false })
  public valid?: boolean;
}

export interface ReportDetailDocument extends ReportDetail, Document<string> {
  _id: string;
}

export const ReportDetailSchema: Schema<ReportDetailDocument> = SchemaFactory.createForClass(ReportDetail);
