import { Document } from 'mongoose';
import { VideoInfoInterface } from '../interfaces';

export interface VideoInfoModel extends VideoInfoInterface, Document {
}
