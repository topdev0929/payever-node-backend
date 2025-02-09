// tslint:disable: typedef
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ChatMessageAttachmentHttpRequestDto,
} from './aliases';

export class ChatDraftMessageCreateHttpRequestDto {
  @ApiProperty({ required: false })
  @IsUUID(4)
  @IsOptional()
  public _id?: string;

  @ApiProperty({
    isArray: true,
    required: false,
    type: ChatMessageAttachmentHttpRequestDto,
  })
  @Type(() => ChatMessageAttachmentHttpRequestDto)
  @ValidateNested({ each: true })
  public attachments: ChatMessageAttachmentHttpRequestDto[];

  @ApiProperty()
  @IsString()
  public content: string;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  public data?: {
    [key: string]: string;
  } = { };
}
