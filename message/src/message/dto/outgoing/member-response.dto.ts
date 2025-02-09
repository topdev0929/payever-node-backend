import { ApiProperty } from '@nestjs/swagger';
import { ChatMemberRoleEnum } from '@pe/message-kit';

import { ProfileHttpResponseDto } from './profile.dto';
import { UserHttpResponseDto } from './user.dto';
import { ChatMember } from '../../submodules/platform';
import { MemberPermissionsHttpResponseDto } from './member-permissions.dto';

export class MemberResponseHttpResponseDto implements Pick<ChatMember, 'role' | 'permissions'> {
  @ApiProperty()
  public role: ChatMemberRoleEnum;

  @ApiProperty()
  public user: UserHttpResponseDto;

  @ApiProperty({
    type: ProfileHttpResponseDto,
  })
  public profile: ProfileHttpResponseDto;

  @ApiProperty({
    type: MemberPermissionsHttpResponseDto,
  })
  public permissions: MemberPermissionsHttpResponseDto;
}
