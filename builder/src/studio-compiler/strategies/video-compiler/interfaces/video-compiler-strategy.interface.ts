import { VideoCompilerEffectEnum } from '../../../enums';
import { ResolutionDto } from '../../../dtos';
import { PebEffect } from '@pe/builder-core';

export interface VideoCompilerStrategyInterface {
  type: VideoCompilerEffectEnum;
  runTask: (
    folder: string,
    fps: number,
    size: ResolutionDto,
    body: PebEffect,
  ) => Promise<void>;
}
