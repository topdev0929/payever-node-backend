import { Document } from 'mongoose';
import { MediaInfoInterface } from '../interfaces';

export interface MediaInfoModel extends MediaInfoInterface, Document {
}
