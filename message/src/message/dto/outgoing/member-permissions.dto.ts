import { ApiProperty } from '@nestjs/swagger';

import { MemberPermissions } from '../../submodules/platform';

export class MemberPermissionsHttpResponseDto
  implements Omit<MemberPermissions, 'addMembers' | 'changeGroupInfo' | 'pinMessages'> {
  @ApiProperty()
  public sendMedia: boolean;

  @ApiProperty()
  public sendMessages: boolean;
}
