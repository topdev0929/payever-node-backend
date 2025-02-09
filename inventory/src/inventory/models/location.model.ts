import { Document } from 'mongoose';
import { LocationInterface } from '../interfaces';

export interface LocationModel extends LocationInterface, Document {
}
