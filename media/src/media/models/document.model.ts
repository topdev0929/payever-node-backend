import { Document } from 'mongoose';

import { DataInterface } from '../interfaces/';

export interface DataModel extends DataInterface, Document {
}
