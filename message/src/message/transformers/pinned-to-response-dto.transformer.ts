import { PinnedResponseDto } from '../dto';
import { Pinned } from '../submodules/platform';
import { MessagingTransformerOptionsInterface } from '../interfaces';

export function pinnedToResponseDtoTransformer(
  pinned: Pinned,
  options: MessagingTransformerOptionsInterface = {
    contacts: null,
    forUser: null,
  },
): PinnedResponseDto {
  if (!pinned.forAllUsers && options.forUser && pinned.pinner !== options.forUser) {
    return null;
  }

  return {
    _id: pinned._id,
    contacts: options.contacts,
    forAllUsers: pinned.forAllUsers,
    message: pinned.message,
    messageId: pinned.messageId,
    pinner: pinned.pinner,
  };
}
