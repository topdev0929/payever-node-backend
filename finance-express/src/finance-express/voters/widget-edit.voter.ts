import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';
import { WidgetModel } from '../interfaces/entities';

@Voter()
@Injectable()
export class WidgetEditVoter extends AbstractVoter {
  public static readonly EDIT: string = 'widget-edit';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === WidgetEditVoter.EDIT;
  }

  protected async voteOnAttribute(
    attribute: string,
    widget: WidgetModel,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    await widget.populate('business').execPopulate();

    return canEdit(user, widget);
  }
}

function canEdit(user: AccessTokenPayload, widget: WidgetModel): boolean {
  if (!user) {
    return false;
  }

  return user.isAdmin() || BusinessAccessValidator.isAccessAllowed(
    user.getRole(RolesEnum.merchant),
    [
      { microservice: 'finance-express', action: AclActionsEnum.create },
      { microservice: 'finance-express', action: AclActionsEnum.update },
    ],
    widget.businessId,
  );
}
