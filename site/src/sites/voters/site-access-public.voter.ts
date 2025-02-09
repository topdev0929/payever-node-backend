import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, Voter } from '@pe/nest-kit';
import { SiteDocument } from '../schemas';
import { SiteVoterCodesEnum } from '../enums';

@Voter()
@Injectable()
export class PublicSiteAccessVoter extends AbstractVoter {
  protected async supports(attribute: string, site: SiteDocument): Promise<boolean> {
    return attribute === SiteVoterCodesEnum.ACCESS && 
      site.accessConfigDocument?.length > 0 && 
      !site.accessConfigDocument[0]?.isPrivate;
  }

  protected async voteOnAttribute(
    attribute: string,
    site: SiteDocument,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    return true;
  }
}
