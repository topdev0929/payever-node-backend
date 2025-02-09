import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { ImageCompilerEffectEnum, ServiceTagEnum } from '../../enums';
import { ImageCompilerEffectService } from '../../services';
import { ImageCompilerStrategyInterface } from './interfaces';
import * as Jimp from 'jimp';
import { PebEffect } from '@pe/builder-core';

@Injectable()
@ServiceTag(ServiceTagEnum.IMAGE_COMPILER)
export class CropStrategy implements ImageCompilerStrategyInterface {
  public readonly type: ImageCompilerEffectEnum = ImageCompilerEffectEnum.CROP;

  constructor(
    private readonly imageCompilerEffectService: ImageCompilerEffectService,
    private logger: Logger,
  ) {
  }

  public async runTask(
    file: string,
    effect: PebEffect,
  ): Promise<void> {
    this.logger.log('Crop...');
    await Jimp.read(file).then(async (image: Jimp) => {
      image.crop(effect.payload.x, effect.payload.y, effect.payload.width, effect.payload.height);
      await image.writeAsync(file);
    });
  }
}
