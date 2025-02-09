import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { ImageCompilerEffectEnum, ServiceTagEnum } from '../../enums';
import { ImageCompilerEffectService, ImageCompilerService } from '../../services';
import { ImageCompilerStrategyInterface } from './interfaces';
import * as Jimp from 'jimp';
import * as rimraf from 'rimraf';
import { CompileResultInterface } from '../../interfaces';
import { PebEffect } from '@pe/builder-core';

@Injectable()
@ServiceTag(ServiceTagEnum.IMAGE_COMPILER)
export class MaskStrategy implements ImageCompilerStrategyInterface {
  public readonly type: ImageCompilerEffectEnum = ImageCompilerEffectEnum.MASK;

  constructor(
    private readonly imageCompilerEffectService: ImageCompilerEffectService,
    private readonly imageCompilerService: ImageCompilerService,
    private logger: Logger,
  ) {
  }

  public async runTask(
    file: string,
    effect: PebEffect,
  ): Promise<void> {
    this.logger.log('Mask...');
    let source: string = effect.payload.url;
    let compileResult: CompileResultInterface;

    if (effect.payload.compile) {
      compileResult = await this.imageCompilerService.compile(effect.payload.compile);
      source = compileResult.file;
    }

    await Jimp.read(file).then(async (image: Jimp) => {
      await Jimp.read(source).then(async (compositeImage: Jimp) => {
        image.mask(compositeImage, effect.payload.x, effect.payload.y);
      });
      await image.writeAsync(file);
    });

    rimraf(compileResult.folder, ( ) => { });
  }
}
