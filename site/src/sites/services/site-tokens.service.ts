import { Injectable } from '@nestjs/common';
import {
  AccessTokenParamsModel,
  AccessTokenResultModel,
  Hash,
  RolesEnum,
  TokensGenerationService,
  TokenType,
  UserTokenInterface,
  UserRoleGuest,
} from '@pe/nest-kit';
import { v4 as uuid } from 'uuid';
import { environment } from '../../environments';
import { SiteDocument } from '../schemas';

@Injectable()
export class SiteTokensService {
  private expiresIn: number;
  constructor(
    private readonly tokenGenerator: TokensGenerationService,
  ) {
    this.expiresIn = environment.jwtOptions.signOptions.expiresIn;
  }

  public async issueTokenForSite(site: SiteDocument, userAgent: string): Promise<AccessTokenResultModel> {
    return this.tokenGenerator.issueToken({
      accessToken: {
        expiresIn: this.expiresIn,
        forceUseRedis: false,
        hash: Hash.generate(userAgent),
        useRabbit: true,
        userModel: this.getGuestUserModel(site),
      },
    } as AccessTokenParamsModel);
  }

  private getGuestUserModel(site: SiteDocument): UserTokenInterface {
    return {
      email: '',
      firstName: 'default',
      id: uuid(),
      isVerified: true,
      lastName: 'default',
      roles: [{
        name: RolesEnum.guest,
        permissions: [
          {
            acls: [
              {
                microservice : 'site',
                read : true,
              },
            ],
            siteId: site.id,
          },
        ],
      } as UserRoleGuest],
      tokenId: uuid(),
      tokenType: TokenType.common,
    };
  }
}
