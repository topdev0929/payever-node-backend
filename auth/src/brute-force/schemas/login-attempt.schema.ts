import { Schema } from 'mongoose';

import { TWENTY_MINUTES_IN_SECONDS } from '../constants/bruteforce';

export const LoginAttemptSchemaName: string = 'LoginAttempt';

export const LoginAttemptSchema: Schema = new Schema(
  {
    createdAt: { type: Date, expires: TWENTY_MINUTES_IN_SECONDS, default: Date.now },
    ipAddress: { type: String },
    success: { type: Boolean, required: true },
    user: { type: String, ref: 'User' },
  },
  {
    autoIndex: true,
    collection: 'login-attempts',
  },
).index({ user: 1 });

LoginAttemptSchema.statics.logAttempt = async function(
  userId: string,
  ipAddress: string,
  success: boolean,
): Promise<any> {
  return this.create({ user: userId, success, ipAddress });
};

LoginAttemptSchema.statics.clearLoginFailures = async function(
  userId: string,
  ipAddress: string,
): Promise<void> {
  return this.deleteMany({ success: false, $or: [{ ipAddress }, { user: userId }]});
};
