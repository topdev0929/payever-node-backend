// tslint:disable: typedef
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsUUID,
  IsEnum,
  IsObject,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ChatMessageType, ChatMessageTypes } from '@pe/message-kit';

import {
  ChatMessageAttachmentWsRequestDto,
  ChatMessageComponentWsRequestDto,
  ChatMessageInteractiveWsRequestDto,
} from './incoming';

import {
  ForwardFromMessageDto,
} from '../../message/dto/chat-message-forward.dto';

export class MessageCreateWsRequestDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  public _id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public action?: string;

  @ApiProperty({
    isArray: true,
    required: false,
    type: ChatMessageAttachmentWsRequestDto,
  })
  @IsOptional()
  @Type(() => ChatMessageAttachmentWsRequestDto)
  @IsNotEmpty()
  public attachments: ChatMessageAttachmentWsRequestDto[];

  @ApiProperty()
  @IsUUID(4)
  @IsNotEmpty()
  public chat: string;

  @ApiProperty()
  @ValidateIf((o: MessageCreateWsRequestDto) => o.type === 'text')
  @IsString()
  @IsNotEmpty()
  public content?: string;
    
  @ApiProperty()
  @IsString()
  @IsOptional()
  public contentType?: string;

  @ApiProperty()
  @IsOptional()  
  public contentPayload?: any;

  @ApiProperty({ isArray: true, required: false, type: ChatMessageComponentWsRequestDto })
  @ValidateIf((o: MessageCreateWsRequestDto) => o.type === 'template')
  @ValidateNested({ each: true })
  @Type(() => ChatMessageComponentWsRequestDto)
  @IsNotEmpty()
  public components?: ChatMessageComponentWsRequestDto[];

  @ApiProperty({ required: false, type: ChatMessageInteractiveWsRequestDto })
  @ValidateIf((o: MessageCreateWsRequestDto) => o.type === 'box')
  @ValidateNested()
  @Type(() => ChatMessageInteractiveWsRequestDto)
  @IsNotEmpty()
  public interactive?: ChatMessageInteractiveWsRequestDto;

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
  @IsNotEmpty()
  public sentAt: Date;

  @ApiProperty()
  @IsEnum(ChatMessageTypes)
  @IsNotEmpty()
  public type: ChatMessageType = 'text';

  @ApiProperty()
  @IsObject()
  @IsOptional()
  public data: {
    [key: string]: string;
  } = { };
}
