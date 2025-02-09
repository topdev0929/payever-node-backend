import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';
import { TerminalModel } from '../models';

@Voter()
@Injectable()
export class TerminalEditVoter extends AbstractVoter {
  public static readonly EDIT: string = 'edit';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === TerminalEditVoter.EDIT;
  }

  protected async voteOnAttribute(
    attribute: string,
    terminal: TerminalModel,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    return canEdit(user, terminal);
  }
}

function canEdit(user: AccessTokenPayload, terminal: TerminalModel): boolean {
  if (!user) {
    return false;
  }

  return user.isAdmin() || BusinessAccessValidator.isAccessAllowed(
    user.getRole(RolesEnum.merchant),
    [
      { microservice: 'pos', action: AclActionsEnum.create },
      { microservice: 'pos', action: AclActionsEnum.update },
    ],
    terminal.businessId,
  );
}
