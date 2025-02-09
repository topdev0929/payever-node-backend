import { ImageCompilerEffectEnum } from '../../../enums';
import { PebEffect } from '@pe/builder-core';

export interface ImageCompilerStrategyInterface {
  type: ImageCompilerEffectEnum;
  runTask: (
    file: string,
    body: PebEffect,
  ) => Promise<void>;
}
