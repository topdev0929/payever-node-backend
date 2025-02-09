import { AbstractVoter, AccessTokenPayload, RolesEnum, Voter } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

import { SubscriptionPlanModel } from '../models';

@Voter()
@Injectable()
export class SubscriptionPlanDelete extends AbstractVoter {
  public static readonly DELETE: string = 'delete-subscription-plan';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === SubscriptionPlanDelete.DELETE;
  }

  protected async voteOnAttribute(
    attribute: string,
    subscriptionPlan: SubscriptionPlanModel,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    await subscriptionPlan.populate('business').execPopulate();

    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [],
      subscriptionPlan.businessId,
    );
  }
}
