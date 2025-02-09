import { Schema, Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';
import { CreateEmployeeInterface } from '../interfaces';
import { BulkImport } from './bulk-import.schema';
import { AclInterface } from '@pe/nest-kit';

@SchemaDecorator()
export class Task {
  @Prop({ default: uuid })
  public _id: string;

  @Prop({ required: true })
  public businessId: string;

  @Prop({ required: true })
  public employeeId: string;
  
  @Prop({ ref: BulkImport.name, required: true })
  public bulkImportId: string;

  @Prop({ type: Schema.Types.Mixed, required: true })
  public incomingData: CreateEmployeeInterface & { acls: AclInterface };
}

export interface TaskDocument extends Task, Document<string> {
  _id: string;
}

export const TaskSchema: Schema<TaskDocument> = SchemaFactory.createForClass(Task);

