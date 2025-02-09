import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { MessagingIntegrationsEnum } from '@pe/message-kit';

export class CustomerChatCreateHttpRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty()
  @IsUUID(4)
  @IsNotEmpty()
  public contact: string;

  @ApiProperty()
  @IsEnum(MessagingIntegrationsEnum)
  @IsNotEmpty()
  public integrationName: MessagingIntegrationsEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public parentFolderId?: string;
}
