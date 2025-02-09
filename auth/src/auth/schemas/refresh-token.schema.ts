import { Query, Schema } from 'mongoose';
import { TokenType } from '../enum';

import type { RefreshTokenInterface } from '../interfaces/refresh-token.interface';

export const RefreshTokenSchemaName: string = 'RefreshToken';

export const RefreshTokenSchema: Schema = new Schema(
  {
    businessId: String,
    ip: String,
    revoked: { type: Boolean, required: true, default: false },
    tokenType: { type: Number, enum: [TokenType.oauth, TokenType.auth], default: TokenType.auth, required: true },
    user: { type: String, required: true, ref: 'User' },
    userAgent: String,
  },
  {
    autoIndex: true,
    collection: 'refreshtokens',
    timestamps: true,
  },
)
  .index({ revoked: 1 })
  .index({ user: 1 });

RefreshTokenSchema.methods.isValid = function(this: RefreshTokenInterface, userAgent?: string): boolean {
  return this.userAgent === userAgent && !this.revoked;
};

RefreshTokenSchema.methods.invalidateRelated = async function(this: RefreshTokenInterface): Promise<Query<any, any>> {
  return this.model(RefreshTokenSchemaName).updateMany({ user: this.user }, { revoked: true });
};

RefreshTokenSchema.methods.invalidateToken = async function(this: RefreshTokenInterface): Promise<Query<any, any>> {
  this.revoked = true;

  return this.save();
};
