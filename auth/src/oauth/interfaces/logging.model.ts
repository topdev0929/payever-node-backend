import { Document } from 'mongoose';

export interface LoggingModel extends Document {
  log: string;
}
