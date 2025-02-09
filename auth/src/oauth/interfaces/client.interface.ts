import { ScopesEnum } from '../../common';
import { User } from '../../users/interfaces';

export interface OAuthClient {
  _id: any;
  businesses: string[];
  name: string;
  organization?: string;
  secret: string;
  scopes: ScopesEnum[];
  grants: string[];
  redirectUri: string;
  accessTokenLifetime: number;
  refreshTokenLifetime: number;
  isActive: boolean;
  user: string | User;
}
