import { Schema } from 'mongoose';

import { TWENTY_MINUTES_IN_SECONDS } from '../constants/bruteforce';

export const SecurityQuestionAttemptSchemaName: string = 'SecurityQuestionAttempt';

export const SecurityQuestionAttemptSchema: Schema = new Schema(
  {
    createdAt: { type: Date, expires: TWENTY_MINUTES_IN_SECONDS, default: Date.now },
    ipAddress: { type: String },
    success: { type: Boolean, required: true },
    user: { type: String, ref: 'User' },
  },
  {
    autoIndex: true,
    collection: 'security-question-attempts',
  },
).index({ user: 1 });
