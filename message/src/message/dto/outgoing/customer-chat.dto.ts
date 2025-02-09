// tslint:disable: max-union-size
import { ApiProperty } from '@nestjs/swagger';

import { MessagingHttpResponseDto } from './messaging.dto';
import { CustomerChat } from '../../../message/submodules/messaging/customer-chat';
import { MessagingIntegrationsEnum } from '@pe/message-kit';
import { MessageHttpResponseDto } from './message.dto';
import { MemberHttpResponseDto } from '../../../message/dto/outgoing/member.dto';

export class CustomerChatHttpResponseDto extends MessagingHttpResponseDto implements Pick<
  CustomerChat,
  '_id' | 'expiresAt' | 'integrationName' |
  'title'
> {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public contact: string;

  @ApiProperty()
  public expiresAt?: Date;

  @ApiProperty()
  public integrationName: MessagingIntegrationsEnum;

  @ApiProperty()
  public messages?: MessageHttpResponseDto[];

  @ApiProperty()
  public members?: MemberHttpResponseDto[];

  @ApiProperty()
  public title: string;
}
