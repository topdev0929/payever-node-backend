import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';
import { WidgetModel } from '../interfaces/entities';

@Voter()
@Injectable()
export class WidgetDeleteVoter extends AbstractVoter {
  public static readonly DELETE: string = 'widget-delete';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === WidgetDeleteVoter.DELETE;
  }

  protected async voteOnAttribute(
    attribute: string,
    widget: WidgetModel,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    await widget.populate('business').execPopulate();

    return canDelete(user, widget);
  }
}

function canDelete(user: AccessTokenPayload, widget: WidgetModel): boolean {
  if (!user) {
    return false;
  }

  return user.isAdmin() || BusinessAccessValidator.isAccessAllowed(
    user.getRole(RolesEnum.merchant),
    [
      { microservice: 'finance-express', action: AclActionsEnum.delete },
    ],
    widget.businessId,
  );
}
