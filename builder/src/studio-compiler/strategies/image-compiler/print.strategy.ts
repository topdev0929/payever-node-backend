import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { ImageCompilerEffectEnum, ServiceTagEnum } from '../../enums';
import { ImageCompilerEffectService } from '../../services';
import { ImageCompilerStrategyInterface } from './interfaces';
import * as Jimp from 'jimp';
import { PebEffect } from '@pe/builder-core';
import { Font } from '@jimp/plugin-print';

@Injectable()
@ServiceTag(ServiceTagEnum.IMAGE_COMPILER)
export class PrintStrategy implements ImageCompilerStrategyInterface {
  public readonly type: ImageCompilerEffectEnum = ImageCompilerEffectEnum.PRINT;

  constructor(
    private readonly imageCompilerEffectService: ImageCompilerEffectService,
    private logger: Logger,
  ) {
  }

  public async runTask(
    file: string,
    effect: PebEffect,
  ): Promise<void> {
    this.logger.log('Print...');
    await Jimp.read(file).then(async (image: Jimp) => {
      let fontType: string;

      switch (effect.payload.color) {
        case 'black' :
          fontType = this.getBlackFont(effect.payload.size);
          break;
        case 'white' :
          fontType = this.getWhiteFont(effect.payload.size);
          break;

        default:
          fontType = Jimp.FONT_SANS_32_WHITE;
      }


      await Jimp.loadFont(fontType).then((font: Font) => {
        image.print(font, effect.payload.x, effect.payload.y, effect.payload.text);
      });
      await image.writeAsync(file);
    });
  }

  private getWhiteFont(size: number): string {
    let fontType: string;

    switch (size) {
      case 8:
        fontType = Jimp.FONT_SANS_8_WHITE;
        break;
      case 16:
        fontType = Jimp.FONT_SANS_16_WHITE;
        break;
      case 32:
        fontType = Jimp.FONT_SANS_32_WHITE;
        break;
      case 64:
        fontType = Jimp.FONT_SANS_64_WHITE;
        break;
      case 128:
        fontType = Jimp.FONT_SANS_128_WHITE;
        break;
      default:
        fontType = Jimp.FONT_SANS_32_WHITE;
    }

    return fontType;
  }
  private getBlackFont(size: number): string {
    let fontType: string;

    switch (size) {
      case 8:
        fontType = Jimp.FONT_SANS_8_BLACK;
        break;
      case 16:
        fontType = Jimp.FONT_SANS_16_BLACK;
        break;
      case 32:
        fontType = Jimp.FONT_SANS_32_BLACK;
        break;
      case 64:
        fontType = Jimp.FONT_SANS_64_BLACK;
        break;
      case 128:
        fontType = Jimp.FONT_SANS_128_BLACK;
        break;
      default:
        fontType = Jimp.FONT_SANS_32_BLACK;
    }

    return fontType;
  }
}
