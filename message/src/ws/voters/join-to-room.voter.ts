import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { AbstractMessagingDocument, AbstractMessaging } from '../../message/submodules/platform';
import { WsVoteCodes } from '../enums';
import { PermissionsService } from '../../message/services/permissions.service';

@Voter()
export class JoinRoomVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: AbstractMessagingDocument): Promise<boolean> {
    return attribute === WsVoteCodes.JOIN_TO_ROOM && AbstractMessaging.hasBusiness(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: AbstractMessagingDocument & { business: string },
    { userToken }: { userToken: UserTokenInterface},
  ): Promise<boolean> {
    return PermissionsService.hasUserTokenAccessToBusiness(userToken, chat.business);
  }
}
