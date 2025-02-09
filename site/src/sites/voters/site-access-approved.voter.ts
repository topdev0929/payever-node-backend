import { Injectable } from '@nestjs/common';

import {
  AbstractVoter,
  AccessTokenPayload,
  ApplicationAccessInterface,
  ApplicationAccessStatusEnum,
  RolesEnum,
  UserRoleCustomer,
  Voter,
} from '@pe/nest-kit';

import { SiteDocument } from '../schemas';
import { SiteVoterCodesEnum } from '../enums';

@Voter()
@Injectable()
export class PrivateSiteApprovedAccessVoter extends AbstractVoter {
  protected async supports(
    attribute: string,
    site: SiteDocument,
  ): Promise<boolean> {
    return attribute === SiteVoterCodesEnum.ACCESS &&
    site.accessConfigDocument?.length > 0 && site.accessConfigDocument[0].isPrivate &&
      site.accessConfigDocument[0].approvedCustomersAllowed
    ;
  }

  protected async voteOnAttribute(
    attribute: string,
    site: SiteDocument,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    if (!user) { return false; }
    const customerRole: UserRoleCustomer = user.getRole(RolesEnum.customer);

    return customerRole?.applications?.some((app: ApplicationAccessInterface) => {
      return app.type === 'site' &&
        app.applicationId === site._id &&
        app.businessId === site.businessId &&
        app.status === ApplicationAccessStatusEnum.APPROVED;
    });
  }
}
