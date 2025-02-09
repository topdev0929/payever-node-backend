import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { MessagingTypeEnum } from '@pe/message-kit';

import { ChatAppEnum } from '../../../message';

export class ChatTemplateCreateHttpRequestDto {
  @ApiProperty()
  @IsEnum(ChatAppEnum)
  @IsNotEmpty()
  public app: ChatAppEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty()
  @IsEnum({ enum: MessagingTypeEnum })
  @IsOptional()
  public type?: MessagingTypeEnum;
}
