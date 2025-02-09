import { Profile } from '../../message';
import { ProfileHttpResponseDto } from '../../message/dto/outgoing/profile.dto';

export function profileToResponseDto(profile: Profile): ProfileHttpResponseDto {
  return {
    _id: profile._id,
    lastSeen: profile.lastSeen,
    status: profile.status,
    username: profile.username,
  };
}
