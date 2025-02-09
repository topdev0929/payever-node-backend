import { Document } from 'mongoose';
import { SampleUserMediaInterface } from '../interfaces';

export interface SampleUserMediaModel extends SampleUserMediaInterface, Document {
}
