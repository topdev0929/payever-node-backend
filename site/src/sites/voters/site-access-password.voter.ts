import { Injectable } from '@nestjs/common';

import {
  AbstractVoter,
  AccessTokenPayload,
  RolesEnum,
  UserRoleGuest,
  Voter,
} from '@pe/nest-kit';
import { AclValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

import { SiteDocument } from '../schemas';
import { SiteVoterCodesEnum } from '../enums';

type GuestRolePermission = UserRoleGuest['permissions'][0];

@Voter()
@Injectable()
export class PrivateSitePasswordAccessVoter extends AbstractVoter {
  protected async supports(
    attribute: string,
    site: SiteDocument,
  ): Promise<boolean> {
    return attribute === SiteVoterCodesEnum.ACCESS &&
      site.accessConfigDocument.length > 0 &&
      site.accessConfigDocument[0].isPrivate &&
      Boolean(site.accessConfigDocument[0].privatePassword);
  }

  protected async voteOnAttribute(
    attribute: string,
    site: SiteDocument,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    if (!user) { return false; }
    const guestRole: UserRoleGuest = user.getRole(RolesEnum.guest);

    return guestRole?.permissions.some((permission: GuestRolePermission) => {
      return permission.siteId === site._id && AclValidator.isValid(permission.acls, [{
        action: 'read',
        microservice: 'site',
      }]);
    });
  }
}
