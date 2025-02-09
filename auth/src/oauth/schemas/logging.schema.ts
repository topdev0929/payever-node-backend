import { Schema } from 'mongoose';

export const LoggingSchemaName: string = 'Logging';

export const LoggingSchema: Schema = new Schema({
  log: String,
});
