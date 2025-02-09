import { AbstractVoter, AccessTokenPayload, RolesEnum, Voter } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';
import { ConnectionPlanInterface } from '../interfaces/entities';
import { ConnectionPlanModel } from '../models';

@Voter()
@Injectable()
export class PlanUpdate extends AbstractVoter {
  public static readonly UPDATE: string = 'update';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === PlanUpdate.UPDATE && PlanUpdate.isPlan(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    plan: ConnectionPlanModel,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    await plan.populate('business').execPopulate();

    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [],
      plan.businessId,
    );
  }

  protected static isPlan(subject: any): subject is ConnectionPlanInterface {
    return subject.planType !== undefined;
  }
}
