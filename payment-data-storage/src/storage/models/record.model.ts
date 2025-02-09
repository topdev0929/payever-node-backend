import { Document } from 'mongoose';
import { RecordInterface } from '../interfaces/record.interface';

export interface RecordModel extends RecordInterface, Document { }
