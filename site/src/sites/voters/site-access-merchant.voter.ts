import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, UserRoleMerchant, Voter } from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

import { SiteDocument } from '../schemas';
import { SiteVoterCodesEnum } from '../enums';

@Voter()
@Injectable()
export class SiteMerchantAccessVoter extends AbstractVoter {
  protected async supports(attribute: string, site: SiteDocument): Promise<boolean> {
    return attribute === SiteVoterCodesEnum.ACCESS && 
      site.accessConfigDocument.length > 0 && 
      site.accessConfigDocument[0].isPrivate;
  }

  protected async voteOnAttribute(attribute: string, site: SiteDocument, user: AccessTokenPayload): Promise<boolean> {
    if (!user) { return false; }
    const merchantRole: UserRoleMerchant = user.getRole(RolesEnum.merchant);
    if (!merchantRole) { return false; }

    return BusinessAccessValidator.isAccessAllowed(
      merchantRole,
      [
        { microservice: 'site', action: AclActionsEnum.read },
      ],
      site.business._id,
    );
  }
}
