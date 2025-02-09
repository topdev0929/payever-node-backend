import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';
import { SiteVoterCodesEnum } from '../enums';
import { SiteDocument } from '../schemas';

@Voter()
@Injectable()
export class SiteEditVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === SiteVoterCodesEnum.EDIT && isSiteModel(subject);
  }

  protected async voteOnAttribute(attribute: string, site: SiteDocument, user: AccessTokenPayload): Promise<boolean> {
    return canEdit(user, site);
  }
}

function canEdit(user: AccessTokenPayload, site: SiteDocument): boolean {
  if (!user) {
    return false;
  }

  return user.isAdmin() || BusinessAccessValidator.isAccessAllowed(
    user.getRole(RolesEnum.merchant),
    [
      { microservice: 'site', action: AclActionsEnum.create },
      { microservice: 'site', action: AclActionsEnum.update },
    ],
    site.business._id,
  );
}

function isSiteModel(subject: SiteDocument): subject is SiteDocument {
  return 'name' in subject && 'accessConfig' in subject;
}
