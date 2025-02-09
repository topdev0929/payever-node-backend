import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { ImageCompilerEffectEnum, ServiceTagEnum } from '../../enums';
import { ImageCompilerEffectService } from '../../services';
import { ImageCompilerStrategyInterface } from './interfaces';
import * as Jimp from 'jimp';
import { PebEffect } from '@pe/builder-core';

@Injectable()
@ServiceTag(ServiceTagEnum.IMAGE_COMPILER)
export class GreyscaleStrategy implements ImageCompilerStrategyInterface {
  public readonly type: ImageCompilerEffectEnum = ImageCompilerEffectEnum.GREYSCALE;

  constructor(
    private readonly imageCompilerEffectService: ImageCompilerEffectService,
    private logger: Logger,
  ) {
  }

  public async runTask(
    file: string,
    effect: PebEffect,
  ): Promise<void> {
    this.logger.log('Greyscale...');
    await Jimp.read(file).then(async (image: Jimp) => {
      if (effect.payload.status) {
        image.greyscale();
        await image.writeAsync(file);
      }
    });
  }
}
