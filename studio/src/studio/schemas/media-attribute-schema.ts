import { Schema } from 'mongoose';
import { AttributeSchemaName } from './attribute.schema';

export const MediaAttributeSchemaName: string = 'MediaAttribute';
export const MediaAttributeSchema: Schema = new Schema(
  {
    attribute: { type: String, ref: AttributeSchemaName },
    value: String,
  },
  { _id : false },
);
