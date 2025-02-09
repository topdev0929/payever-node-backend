import { TokenType } from '@pe/nest-kit/modules/auth/enums/token-type.enum';
export interface RefreshPayload {
  payload: {
    tokenId: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    language?: string;
    tokenType: TokenType;
  };
}
