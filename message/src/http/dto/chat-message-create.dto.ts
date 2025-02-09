// tslint:disable: typedef
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChatMessageType, ChatMessageTypes } from '@pe/message-kit';

import {
  ChatMessageComponentHttpRequestDto,
  ChatMessageInteractiveHttpRequestDto,
  ChatMessageAttachmentHttpRequestDto,
} from './incoming';

import {
  ForwardFromMessageDto,
} from '../../message/dto/chat-message-forward.dto';

export class ChatMessageCreateHttpRequestDto {
  @ApiProperty({ required: false })
  @IsUUID(4)
  @IsOptional()
  public _id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public action?: string;

  @ApiProperty({
    isArray: true,
    required: false,
    type: ChatMessageAttachmentHttpRequestDto,
  })
  @IsOptional()
  @Type(() => ChatMessageAttachmentHttpRequestDto)
  public attachments: ChatMessageAttachmentHttpRequestDto[];

  @ApiProperty({ required: false })
  @ValidateIf((o: ChatMessageCreateHttpRequestDto) => o.type === 'text')
  @IsString()
  public content?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public contentType?: string;

  @ApiProperty()
  @IsOptional()  
  public contentPayload?: any;

  @ApiProperty({ required: false, isArray: true, type: ChatMessageComponentHttpRequestDto })
  @ValidateIf((o: ChatMessageCreateHttpRequestDto) => o.type === 'template')
  @ValidateNested({ each: true })
  @Type(() => ChatMessageComponentHttpRequestDto)
  @IsNotEmpty()
  public components?: ChatMessageComponentHttpRequestDto[];

  @ApiProperty({ required: false, type: ChatMessageInteractiveHttpRequestDto })
  @ValidateIf((o: ChatMessageCreateHttpRequestDto) => o.type === 'text')
  @ValidateNested()
  @Type(() => ChatMessageInteractiveHttpRequestDto)
  @IsOptional()
  public interactive?: ChatMessageInteractiveHttpRequestDto;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public replyTo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public forwardFrom?: ForwardFromMessageDto;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  public sentAt: Date;

  @ApiProperty({ enum: ChatMessageTypes })
  @IsEnum(ChatMessageTypes)
  @IsNotEmpty()
  public type: ChatMessageType = 'text';

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  public data?: {
    [key: string]: string;
  } = { };
}
