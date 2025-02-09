// tslint:disable: max-union-size
import { ApiProperty } from '@nestjs/swagger';
import {
  ChatMessageStatusEnum,
  ChatMessageInteractiveInterface,
  ChatMessageType,
  ChatMessageTypes,
} from '@pe/message-kit';

import {
  AbstractChatMessage,
  ChatTextMessage,
  ChatBoxMessage,
  ChatTemplateMessage,
} from '../../submodules/platform';
import { ChatEventMessage } from '../../submodules/platform/schemas/message/event';
import {
  ChatMessageAttachmentDto,
} from '../chat-message-attachment.dto';
import {
  ChatMessageComponentDto,
} from '../chat-message-template.dto';
import { ForwardFromHttpResponseDto } from './forwarded-from.dto';

export class MessageHttpResponseDto implements
  Pick<AbstractChatMessage,
  '_id' | 'chat' | 'data' | 'type'
  |
  'sentAt' | 'editedAt' | 'status'
  |
  'createdAt' | 'updatedAt'
  >,
  Partial<Pick<ChatTextMessage,
    'attachments' | 'content' | 'forwardFrom' | 'replyTo' | 'sender' | 'readBy'
    |
    'mentions' | 'deletedForUsers'
  >>,
  Partial<Pick<ChatBoxMessage, 'interactive'>>,
  Partial<Pick<ChatEventMessage, 'eventName'>>,
  Partial<Pick<ChatTemplateMessage, 'components'>> {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public chat: string;

  @ApiProperty({ required: false })
  public data: {
    [key: string]: string;
  };

  @ApiProperty({
    enum: ChatMessageTypes,
  })
  public type: ChatMessageType;

  @ApiProperty()
  public sentAt: Date;

  @ApiProperty({ required: false })
  public status?: ChatMessageStatusEnum;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;


  @ApiProperty({ type: [ChatMessageAttachmentDto], required: false })
  public attachments?: ChatMessageAttachmentDto[];

  @ApiProperty({ required: false })
  public content?: string;

  @ApiProperty()
  public contentType?: string;

  @ApiProperty()
  public contentPayload?: any;

  @ApiProperty({ required: false })
  public sender?: string;


  @ApiProperty({ required: false })
  public forwardFrom?: ForwardFromHttpResponseDto;

  @ApiProperty({ required: false })
  public mentions?: string[];

  @ApiProperty({ required: false })
  public replyTo?: string;

  @ApiProperty({ required: false })
  public replyToContent?: string;

  @ApiProperty({ required: false })
  public editedAt?: Date;

  @ApiProperty({ required: false })
  public interactive?: ChatMessageInteractiveInterface;


  @ApiProperty({ type: [ChatMessageComponentDto], required: false })
  public components?: ChatMessageComponentDto[];

  @ApiProperty({ required: false })
  public readBy?: string[];

  @ApiProperty({ required: false })
  public template?: string;

  @ApiProperty({ required: false })
  public eventName?: string;

  //  @TODO: Remove property after message hiding will be implemented in BE filtering
  @ApiProperty({
    deprecated: true,
  })
  public deletedForUsers?: string[];

  public isCachRead?: boolean;
}
