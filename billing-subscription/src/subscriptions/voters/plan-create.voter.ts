import { AbstractVoter, AccessTokenPayload, RolesEnum, Voter } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

import { PlanCreateDto as PlanCreateDto } from '../dto';

@Voter()
@Injectable()
export class PlanCreate extends AbstractVoter {
  public static readonly CREATE: string = 'create';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === PlanCreate.CREATE && subject instanceof PlanCreateDto;
  }

  protected async voteOnAttribute(attribute: string, plan: PlanCreateDto, user: AccessTokenPayload): Promise<boolean> {
    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [],
      plan.businessId,
    );
  }
}
