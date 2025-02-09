// tslint:disable: typedef
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChatMessageType, ChatMessageTypes } from '@pe/message-kit';

import {
  ChatMessageAttachmentHttpRequestDto,
  ChatMessageComponentHttpRequestDto,
  ChatMessageInteractiveHttpRequestDto,
} from '../incoming';

export class ChatMessageTemplateCreateHttpRequestDto {
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

  @ApiProperty()
  @ValidateIf((o: ChatMessageTemplateCreateHttpRequestDto) => o.type === 'text')
  @IsString()
  public content?: string;

  @ApiProperty({ isArray: true, type: ChatMessageComponentHttpRequestDto })
  @ValidateIf((o: ChatMessageTemplateCreateHttpRequestDto) => o.type === 'template')
  @ValidateNested({ each: true })
  @Type(() => ChatMessageComponentHttpRequestDto)
  @IsNotEmpty()
  public components?: ChatMessageComponentHttpRequestDto[];

  @ApiProperty({ required: false, type: ChatMessageInteractiveHttpRequestDto })
  @ValidateIf((o: ChatMessageTemplateCreateHttpRequestDto) => o.type === 'text')
  @ValidateNested()
  @Type(() => ChatMessageInteractiveHttpRequestDto)
  @IsOptional()
  public interactive?: ChatMessageInteractiveHttpRequestDto;

  @ApiProperty({ enum: ChatMessageTypes })
  @IsEnum(ChatMessageTypes)
  @IsNotEmpty()
  public type: ChatMessageType = 'text';
}
