import { Document } from 'mongoose';
import { CronTaskInterface } from '../interfaces';

export interface CronTaskModel extends CronTaskInterface, Document {
  id: string;
}
