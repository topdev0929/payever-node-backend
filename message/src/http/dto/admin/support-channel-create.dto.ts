import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { SupportChannel } from '../../../message/submodules/messaging/support-channels';

type props = 'title';
type optionalProps = 'photo' | 'description';

export class SupportChannelCreateDto implements
  Pick<SupportChannel, props>,
  Partial<Pick<SupportChannel, optionalProps>> {

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public photo?: string;
}
