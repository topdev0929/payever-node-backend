/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsObject,
} from 'class-validator';

import { ChatMessageInteractiveIconEnum } from '@pe/message-kit';

export class ChatMessageInteractiveDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public action?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public defaultLanguage: string = 'en';

  @ApiProperty({ enum: Object.values(ChatMessageInteractiveIconEnum), required: false })
  @IsEnum(ChatMessageInteractiveIconEnum)
  @IsOptional()
  public icon?: ChatMessageInteractiveIconEnum;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public image?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public marked?: boolean;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  public translations: {
    [key: string]: string;
  };
}
