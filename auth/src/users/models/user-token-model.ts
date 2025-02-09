import { plainToClass, Expose } from 'class-transformer';
import { v4 as uuid } from 'uuid';
import { TokenType } from '@pe/nest-kit/modules/auth/enums/token-type.enum';
import { UserRoleInterface, UserTokenInterface } from '@pe/nest-kit';

import { User } from '../interfaces';

export class UserTokenModel implements UserTokenInterface {
  @Expose()
  public id: string;
  @Expose()
  public email: string;
  @Expose()
  public firstName: string;
  @Expose()
  public lastName: string;
  @Expose()
  public isVerified: boolean;
  @Expose()
  public roles: UserRoleInterface[];
  @Expose()
  public tokenId: string;
  @Expose()
  public tokenType: TokenType;
  @Expose()
  public generalAccount: boolean;

  public static fromUser(
    user: User, 
    businessId: string,
    tokenType: TokenType = TokenType.common,
  ): UserTokenModel {
    return plainToClass(
      UserTokenModel,
      {
        ...user.toObject(),
        firstName: user.firstName,
        lastName: user.lastName,
        tokenId: businessId ? `${user._id}|${businessId}` : uuid(),
        tokenType: UserTokenModel.getTokenType(user, tokenType),
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  public static getTokenType(user: User, tokenType: TokenType): TokenType {
    if (tokenType === TokenType.secondFactorAuth) {
      return tokenType;
    }

    if (user.secondFactorRequired) {
      return TokenType.secondFactor;
    }

    return tokenType;
  }
}
