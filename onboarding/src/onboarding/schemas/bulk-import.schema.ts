import { Schema, Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { Report } from './report.schema';

@SchemaDecorator()
export class BulkImport {
  @Prop({ default: uuid })
  public _id: string;

  @Prop({ ref: 'Task', default: [] })
  public tasks: string[];

  @Prop({ ref: Report.name })
  public latestReport: string;
}

export interface BulkImportDocument extends BulkImport, Document<string> {
  _id: string;
}

export const BulkImportSchema: Schema<BulkImportDocument> = SchemaFactory.createForClass(BulkImport);
