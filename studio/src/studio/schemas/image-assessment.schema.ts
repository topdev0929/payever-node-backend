import { Schema } from 'mongoose';

export const ImageAssessmentSchemaName: string = 'UserImageAssessment';
export const ImageAssessmentSchema: Schema = new Schema(
  {
    aesthetic: Number,
    technical: Number,
  },
  { _id : false },
);
