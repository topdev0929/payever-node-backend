import { Injectable, Logger } from '@nestjs/common';
import { AccessTokenPayload, RolesEnum, UserRoleInterface, UserRoleMerchant, UserRoleOauth } from '@pe/nest-kit';

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
          clientId: user?.clientId,
          email: user?.email,
          firstName: user?.firstName,
          id: user?.id,
          lastName: user?.lastName,
          message: 'Could not retrieve business id from oauth token',
          tokenId: user?.tokenId,
        },
        'OauthService',
      );
    }

    return businessId;
  }

  private retrieveBusinessIdFromTokenPayload(user: AccessTokenPayload, businessIdToFind?: string): string {
    const userRole: UserRoleInterface =
      user.roles.find((x: UserRoleInterface) => [RolesEnum.merchant, RolesEnum.oauth].includes(x.name));
    if (!userRole) {
      return null;
    }

    const role: UserRoleOauth | UserRoleMerchant = userRole as UserRoleOauth | UserRoleMerchant;
    if (businessIdToFind) {
      for (const permission of role.permissions) {
        if (permission.businessId === businessIdToFind) {
          return permission.businessId;
        }
      }

      return null;
    }

    return role.permissions[0].businessId;
  }
}
