import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VideoActionDto } from './video-action.dto';
import { PebEffect } from '@pe/builder-core';

export class VideoCompilerEffectDto implements PebEffect {
  @IsOptional()
  public compile: VideoActionDto;

  @IsString()
  @IsNotEmpty()
  public target: string;

  @IsString()
  @IsNotEmpty()
  public type: any;

  @IsOptional()
  public payload: any;
}
