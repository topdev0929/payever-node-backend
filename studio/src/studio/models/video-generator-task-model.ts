import { Document } from 'mongoose';
import { VideoGeneratorTaskInterface } from '../interfaces';

export interface VideoGeneratorTaskModel extends VideoGeneratorTaskInterface, Document {
}
