import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { TWENTY_MINUTES_IN_SECONDS } from '../constants/bruteforce';

export const RegisterAttemptSchemaName: string = 'RegisterAttempt';

export const RegisterAttemptSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    createdAt: { type: Date, expires: TWENTY_MINUTES_IN_SECONDS, default: Date.now },
    ipAddress: { type: String },
    user: { type: String, ref: 'User' },
  },
  {
    autoIndex: true,
    collection: 'register-attempts',
  },
).index({ ipAddress: 1 });

RegisterAttemptSchema.statics.logAttempt = async function(
  userId: string,
  ipAddress: string,
): Promise<any> {
  return this.create({ user: userId, ipAddress });
};

RegisterAttemptSchema.statics.clearRegisterAttemptsByIpAddress = async function(
  ipAddress: string,
): Promise<void> {
  return this.deleteMany({
    ipAddress,
  });
};

RegisterAttemptSchema.statics.clearRegisterAttemptsByUserId = async function(
  userId: string,
): Promise<void> {
  return this.deleteMany({
    userId,
  });
};
