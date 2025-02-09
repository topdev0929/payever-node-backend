import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUrl,
  IsNumber,
  IsObject,
  IsMimeType,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { ChatMessageAttachmentInterface } from '@pe/message-kit';

export class ChatMessageAttachmentDto implements ChatMessageAttachmentInterface {
  @ApiProperty()
  @IsMimeType()
  @IsNotEmpty()
  public mimeType: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public size: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  public url: string;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  public data?: {
    [key: string]: string;
  };
}
