import { Document } from 'mongoose';
import { ReportInterface } from '../interfaces';

export interface ReportModel extends ReportInterface, Document {
}
