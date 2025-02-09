import * as path from 'path';

import * as ffmpeg from 'fluent-ffmpeg';

import { MimeTypesEnum } from '../../tools/mime-types.enum';

import { CompressResult } from '../interfaces';

const MP4_FORMAT: string = 'mp4';

export class VideoCompressionHelper {
  public static async takeScreenshot(
    inputFilePath: string,
    outputFilePath: string,
  ): Promise<void> {
    if (!outputFilePath.endsWith('.png')) {
      throw new Error(`outputFilePath should ends with png`);
    }

    return new Promise((
        resolve: (value: void | PromiseLike<void>) => void, 
        reject: (reason?: any) => void
      ): void => {
        ffmpeg(inputFilePath)
          .screenshot({
            count: 1,
            filename: path.basename(outputFilePath),
            folder: path.dirname(outputFilePath),
            timestamps: [0],
          })
          .on('end', resolve)
          .on('error', reject);
    });
  }

  public static async compress(
    inputFilePath: string,
    outputFilePath: string,
  ): Promise<CompressResult> {
    // tslint:disable-next-line: typedef
    return new Promise<void>((resolve, reject): void => {
      ffmpeg(inputFilePath)
        .videoCodec('libx264')
        .outputOption([
          '-profile:v main',
          '-vf format=yuv420p',
        ])
        .audioCodec('aac')
        .toFormat(MP4_FORMAT)
        .outputOption([
          '-movflags +faststart',
        ])
        .on('end', resolve)
        .on('error', reject)
        .output(outputFilePath)
        .run();
    }).then(() => {
      return {
        mimeType: MimeTypesEnum.MP4,
      };
    });
  }
}
