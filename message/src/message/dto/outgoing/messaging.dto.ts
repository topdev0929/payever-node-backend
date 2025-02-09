import { ApiProperty } from '@nestjs/swagger';

import { MessagingTypeEnum } from '@pe/message-kit';

import { AbstractMessaging } from '../../../message/submodules/platform';

import { MessageHttpResponseDto } from '../../../message/dto/outgoing/message.dto';
import { PinnedResponseDto } from './pinned.dto';

type props = '_id' | 'title' | 'type';
export class MessagingHttpResponseDto implements Pick<AbstractMessaging, props> {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public business: string;

  @ApiProperty()
  public deleted?: boolean;

  @ApiProperty({ type: [MessageHttpResponseDto], required: false })
  public messages?: MessageHttpResponseDto[];

  @ApiProperty()
  public title: string;

  @ApiProperty({ enum: Object.values(MessagingTypeEnum) })
  public type: MessagingTypeEnum;

  @ApiProperty({ type: [PinnedResponseDto], required: false })
  public pinned?: PinnedResponseDto[];

  @ApiProperty()
  public createdAt: Date;
}
