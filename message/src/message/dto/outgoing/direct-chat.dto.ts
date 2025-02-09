// tslint:disable: max-union-size
import { ApiProperty } from '@nestjs/swagger';

import { MessagingHttpResponseDto } from './messaging.dto';
import { DirectChat } from '../../../message/submodules/messaging/direct-chat';
import { MessageHttpResponseDto } from './message.dto';
import { MemberHttpResponseDto } from '../../../message/dto/outgoing/member.dto';

export class DirectChatHttpResponseDto extends MessagingHttpResponseDto implements Pick<
DirectChat,
  '_id' | 'expiresAt' |
  'title'
> {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public expiresAt?: Date;

  @ApiProperty()
  public messages?: MessageHttpResponseDto[];

  @ApiProperty()
  public members?: MemberHttpResponseDto[];

  @ApiProperty()
  public title: string;
}
