import { ChatMember, ChatMemberEmbeddedDocument } from '../../message/submodules/platform';
import { MemberHttpResponseDto } from '../dto/outgoing/member.dto';

export function memberToResponseDto(member: ChatMember): MemberHttpResponseDto {
  return {
    addMethod: member.addMethod,
    addedBy: member.addedBy,
    guestUser: member.guestUser,
    notificationDisabledUntil: member.notificationDisabledUntil,
    role: member.role,
    user: member.user,

    createdAt: (member as ChatMemberEmbeddedDocument).createdAt,
    updatedAt: (member as ChatMemberEmbeddedDocument).updatedAt,
  };
}
