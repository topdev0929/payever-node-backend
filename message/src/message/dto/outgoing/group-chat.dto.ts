// tslint:disable: max-union-size
import { ApiProperty } from '@nestjs/swagger';
import { GroupChat } from '../../../message/submodules/messaging/group-chats';
import { MessageHttpResponseDto } from './message.dto';
import { MemberHttpResponseDto } from '../../../message/dto/outgoing/member.dto';
import { MessagingHttpResponseDto } from './messaging.dto';
import { Permissions } from '../../submodules/platform/schemas/permissions.schema';

export class GroupChatHttpResponseDto extends MessagingHttpResponseDto implements Pick<
  GroupChat,
  '_id' | 'expiresAt' | 
  'title' | 'description' | 'photo' | 'permissions'
> {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public expiresAt?: Date;

  @ApiProperty({
    type: [MessageHttpResponseDto],
  })
  public messages: MessageHttpResponseDto[];

  @ApiProperty()
  public members?: MemberHttpResponseDto[];

  @ApiProperty()
  public removedMembers?: MemberHttpResponseDto[];

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public photo: string;

  @ApiProperty()
  public permissions?: Permissions;

  @ApiProperty()
  public usedInWidget: boolean;
}
