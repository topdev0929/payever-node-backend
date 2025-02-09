import { ApiProperty } from '@nestjs/swagger';
import { MessagingIntegrationsEnum } from '@pe/message-kit';
import { BadRequestException } from '@nestjs/common';
import {
  IsEnum,
  IsString,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

import { ChannelTypeEnum } from '../../../message';
import { CommonChannel } from '../../../message/submodules/messaging/common-channels';
import { Transform } from 'class-transformer';

export class CommonChannelCreateDto implements Partial<CommonChannel> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((value: string) => {
    if ((/^\s+$/.test(value))) {
      throw new BadRequestException(`Title should not have white spaces`);
    }

    return value.trim();
  })

  public title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public photo?: string;

  @ApiProperty()
  @IsString({ each: true })
  public contacts: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public usedInWidget?: boolean;

  @ApiProperty({ enum: MessagingIntegrationsEnum, required: false })
  @IsEnum(MessagingIntegrationsEnum)
  @IsOptional()
  public integrationName: MessagingIntegrationsEnum = MessagingIntegrationsEnum.Internal;

  @ApiProperty()
  @IsString()
  @Matches(/[a-z0-9-_]+/i)
  @IsOptional()
  public slug?: string;

  @ApiProperty({ enum: ChannelTypeEnum })
  @IsEnum(ChannelTypeEnum)
  @IsOptional()
  public subType?: ChannelTypeEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public parentFolderId?: string;
}
