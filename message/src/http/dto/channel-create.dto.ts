import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

import { ChannelTypeEnum } from '../../message';

export class ChannelCreateHttpRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public description: string;

  @ApiProperty({ enum: ChannelTypeEnum })
  @IsEnum(ChannelTypeEnum)
  @IsNotEmpty()
  public type: ChannelTypeEnum;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public photo: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public signed: boolean;
}
