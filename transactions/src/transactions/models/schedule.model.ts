import { Document } from 'mongoose';
import { ScheduleInterface } from '../interfaces/schedule.interface';

export interface ScheduleModel extends ScheduleInterface, Document {

}
