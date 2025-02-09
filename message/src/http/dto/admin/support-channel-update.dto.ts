import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsOptional,
} from 'class-validator';

import { SupportChannel } from '../../../message/submodules/messaging/support-channels';

type optionalProps = 'title' | 'photo' | 'description';

export class SupportChannelUpdateDto implements
  Partial<Pick<SupportChannel, optionalProps>> {

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public photo?: string;
}
