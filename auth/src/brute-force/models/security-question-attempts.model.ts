import { Document, Model } from 'mongoose';
import { SecurityQuestionAttemptInterface } from '../interfaces';

export interface SecurityQuestionAttemptModel extends Model<SecurityQuestionAttemptInterface & Document> {
}
