import { Schema, Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

@SchemaDecorator()
export class Report {
  @Prop({ default: uuid })
  public _id: string;

  @Prop({ required: true })
  public bulkImportId: string;
}

export interface ReportDocument extends Report, Document<string> {
  _id: string;
}

export const ReportSchema: Schema<ReportDocument> = SchemaFactory.createForClass(Report);
