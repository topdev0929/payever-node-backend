import { AbstractVoter, AccessTokenPayload, RolesEnum, Voter } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';
import { BusinessAffiliateModel } from '../models';

@Voter()
@Injectable()
export class BusinessAffiliateEditVoter extends AbstractVoter {
  public static readonly EDIT: string = 'business-affiliate-delete';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === BusinessAffiliateEditVoter.EDIT;
  }

  protected async voteOnAttribute(
    attribute: string,
    businessAffiliate: BusinessAffiliateModel,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    await businessAffiliate.populate('business').execPopulate();

    return user && businessAffiliate.business && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [],
      businessAffiliate.businessId,
    );
  }
}
