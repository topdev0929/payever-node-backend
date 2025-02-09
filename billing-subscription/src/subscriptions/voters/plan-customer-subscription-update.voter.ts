import { AbstractVoter, AccessTokenPayload, RolesEnum, Voter } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

import { ConnectionPlanInterface } from '../interfaces/entities';
import { ConnectionPlanModel, CustomerSubscriptionPlanModel } from '../models';

@Voter()
@Injectable()
export class PlanCustomerSubscriptionUpdate extends AbstractVoter {
  public static readonly UPDATE: string = 'update';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === PlanCustomerSubscriptionUpdate.UPDATE && PlanCustomerSubscriptionUpdate.isPlan(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    subscriptionPlan: CustomerSubscriptionPlanModel,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    await subscriptionPlan.populate('plan').execPopulate();
    await (subscriptionPlan.plan as ConnectionPlanModel).populate('business').execPopulate();

    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [],
      (subscriptionPlan.plan as ConnectionPlanModel).businessId,
    );
  }

  protected static isPlan(subject: any): subject is ConnectionPlanInterface {
    return subject.plan !== undefined;
  }
}
