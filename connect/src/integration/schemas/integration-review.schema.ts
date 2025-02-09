import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const IntegrationReviewSchemaName: string = 'IntegrationReview';
export const IntegrationReviewSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    rating: Number,
    reviewDate: String,
    text: String,
    title: String,
    userFullName: String,
    userId: String,
  },
);
