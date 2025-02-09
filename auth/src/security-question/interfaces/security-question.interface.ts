import { Document } from 'mongoose';

export interface SecurityQuestionInterface extends Document {
  answer: string;
  question: string;
  userId: string;
}
