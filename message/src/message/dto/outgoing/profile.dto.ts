// tslint:disable: max-union-size
import { ApiProperty } from '@nestjs/swagger';

import { Profile } from '../..';
import { ChatMemberStatusEnum } from '@pe/message-kit';

export class ProfileHttpResponseDto implements Pick<
  Profile,
  '_id' | 'username' | 'lastSeen' | 'status'
> {
  @ApiProperty()
  public _id: string;

  @ApiProperty({
    type: Date,
  })
  public lastSeen: Date;

  @ApiProperty({
    enum: Object.values(ChatMemberStatusEnum),
    type: String,
  })
  public status: ChatMemberStatusEnum;

  @ApiProperty()
  public username: string;
}
