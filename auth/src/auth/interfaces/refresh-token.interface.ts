import { Document, Query } from 'mongoose';

import { User } from '../../users/interfaces';
import { TokenType } from '../enum';

export interface RefreshTokenInterface extends Document {
  businessId: string;
  user: string | User;
  userAgent: string;
  revoked?: boolean;
  isValid?: (userAgent: string) => boolean;
  invalidateRelated: () => Query<RefreshTokenInterface, any>;
  invalidateToken: () => Promise<RefreshTokenInterface>;
  ip: string;
  tokenType: TokenType;
}
