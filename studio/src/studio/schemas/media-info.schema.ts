import { Schema } from 'mongoose';

export const MediaInfoSchemaName: string = 'MediaInfo';
export const MediaInfoSchema: Schema = new Schema(
  {
    dimension: String,
    duration: String,
    size: String,
    type: String,
  },
  { _id : false },
);
