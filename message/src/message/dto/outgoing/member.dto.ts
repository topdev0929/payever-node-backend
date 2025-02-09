import { ApiProperty } from '@nestjs/swagger';
import { ChatMemberRoleEnum } from '@pe/message-kit';

import { ChatMember, GuestUserInterface } from '../../submodules/platform';
import { AddMemberMethodEnum } from '../../enums';

export class MemberHttpResponseDto implements Pick<
  ChatMember,
  // tslint:disable-next-line: max-union-size
  'user' | 'role' | 'notificationDisabledUntil' | 'addedBy' | 'addMethod' | 'guestUser'
> {
  @ApiProperty()
  public addMethod: AddMemberMethodEnum;

  @ApiProperty()
  public addedBy: string;

  @ApiProperty()
  public user: string;

  @ApiProperty()
  public guestUser: GuestUserInterface;

  @ApiProperty()
  public role: ChatMemberRoleEnum;

  @ApiProperty()
  public notificationDisabledUntil?: Date;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;
}
