import { ApiProperty } from '@nestjs/swagger';

import {
  ChatMessageType,
  ChatMessageTypes,
  ChatMessageStatusEnum,
} from '@pe/message-kit';
import { ChatMessageAttachmentDto } from '../chat-message-attachment.dto';
import { ChatMessageComponentDto } from '../chat-message-template.dto';
import { ChatMessageInteractiveDto } from '../chat-message-interactive.dto';

export class ChatMessageHttpOrWsResponseDto {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public action?: string;

  @ApiProperty({ type: [ChatMessageAttachmentDto] })
  public attachments?: ChatMessageAttachmentDto[];

  @ApiProperty()
  public chat: string;

  @ApiProperty({ required: false })
  public content?: string;

  @ApiProperty({ required: false, type: [ChatMessageComponentDto] })
  public components?: ChatMessageComponentDto[];

  @ApiProperty({ required: false })
  public editedAt?: Date;

  @ApiProperty({ required: false, type: ChatMessageInteractiveDto })
  public interactive?: ChatMessageInteractiveDto;

  @ApiProperty({ required: false })
  public isPinned?: boolean;

  @ApiProperty({ required: false })
  public sender?: string;

  @ApiProperty()
  public sentAt: Date;

  @ApiProperty({ required: false, enum: ChatMessageStatusEnum})
  public status?: ChatMessageStatusEnum;

  @ApiProperty({ required: false })
  public replyTo?: string;

  @ApiProperty({ enum: ChatMessageTypes })
  public type: ChatMessageType = 'text';

  @ApiProperty({ required: false })
  public createdAt?: Date;

  @ApiProperty({ required: false })
  public updatedAt?: Date;

  @ApiProperty({ required: false })
  public data?: {
    [key: string]: string;
  };
}
