import { HttpException } from '@nestjs/common';
import * as imagemin from 'imagemin';
import * as imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

import { readFileAsync, writeFileAsync } from '../../tools/fs-tools.helper';
import { CompressResult } from '../interfaces';

export class ImageCompressionHelper {
  public static async compress(
    inputFilePath: string,
    outputFilePath: string,
  ): Promise<CompressResult> {
    const image: Buffer = await readFileAsync(inputFilePath);
    let compressed: Buffer = null;
    try {
      compressed = await imagemin.buffer(
        image,
        {
          plugins: [
            imageminJpegtran(),
            imageminPngquant({ dithering: false, speed: 10, strip: true }),
          ],
        },
      );
    } catch (ex) {
      throw new HttpException('failed to compress image', 503);
    }
    await writeFileAsync(outputFilePath, compressed);

    return {
      mimeType: null,
    };
  }
}
