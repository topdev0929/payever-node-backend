import { Document } from 'mongoose';
import { ApiCallInterface } from '../interfaces';

export interface ApiCallModel extends ApiCallInterface, Document {
}
