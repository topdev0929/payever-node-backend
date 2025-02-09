import { Document } from 'mongoose';
import { ImageAssessmentTaskInterface } from '../interfaces';

export interface ImageAssessmentTaskModel extends ImageAssessmentTaskInterface, Document {
}
