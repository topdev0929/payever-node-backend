import { Document } from 'mongoose';
import { ScheduleInterface } from '../interfaces';

export interface ScheduleModel extends ScheduleInterface, Document {
  id: string;
}
