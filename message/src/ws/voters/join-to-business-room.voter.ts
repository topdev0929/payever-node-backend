import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';

import { WsVoteCodes } from '../enums';
import { PermissionsService } from '../../message/services/permissions.service';

@Voter()
export class JoinBusinessRoomVoter extends AbstractVoter {
  protected async supports(attribute: string, user: UserTokenInterface): Promise<boolean> {
    return attribute === WsVoteCodes.JOIN_TO_BUSINESS_ROOM;
  }

  protected async voteOnAttribute(
    attribute: string,
    userToken: UserTokenInterface,
    businessId: string,
  ): Promise<boolean> {
    return PermissionsService.hasUserTokenAccessToBusiness(userToken, businessId);
  }
}
