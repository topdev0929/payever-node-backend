import { ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AccessTokenPayload, RolesEnum, UserRoleInterface, UserRoleOauth } from '@pe/nest-kit';

@Injectable()
export class OauthService {
  constructor(
    private readonly logger: Logger,
  ) { }

  public getOauthUserBusiness(user: AccessTokenPayload, businessIdToFind?: string): string {
    const businessId: string = this.retrieveBusinessIdFromTokenPayload(user, businessIdToFind);

    if (!businessId) {
      this.logger.warn(
        {
          businessIdToFind,
          clientId: user?.clientId,
          email: user?.email,
          firstName: user?.firstName,
          id: user?.id,
          lastName: user?.lastName,
          message: 'Could not retrieve business id from oauth token',
          roles: user.roles,
          tokenId: user?.tokenId,
        },
        'OauthService',
      );

      throw (businessIdToFind ? new ForbiddenException() : new UnauthorizedException());
    }

    return businessId;
  }

  private retrieveBusinessIdFromTokenPayload(user: AccessTokenPayload, businessIdToFind?: string): string {
    const userRole: UserRoleInterface = user.roles.find((x: UserRoleInterface) => x.name === RolesEnum.oauth);
    if (!userRole) {
      return null;
    }

    const oauthRole: UserRoleOauth = userRole as UserRoleOauth;
    if (businessIdToFind) {
      for (const permission of oauthRole.permissions) {
        if (permission.businessId === businessIdToFind) {
          return permission.businessId;
        }
      }

      return null;
    }

    return oauthRole?.permissions?.[0]?.businessId;
  }
}
