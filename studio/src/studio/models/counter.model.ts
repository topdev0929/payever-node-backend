import { Document } from 'mongoose';
import { CounterInterface } from '../interfaces';

export interface CounterModel extends CounterInterface, Document {
}
