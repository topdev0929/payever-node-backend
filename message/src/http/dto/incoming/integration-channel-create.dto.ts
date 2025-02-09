import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

import { CommonChannel } from '../../../message/submodules/messaging/common-channels';

type props = 'title';
type optionalProps =  | 'description' | 'photo' | 'usedInWidget';

export class IntegrationChannelCreateDto implements
  Pick<CommonChannel, props>,
  Partial<Pick<CommonChannel, optionalProps>> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public usedInWidget?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public photo?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public parentFolderId?: string;
}
