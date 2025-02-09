import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { ServiceTagEnum, VideoCompilerEffectEnum } from '../../enums';
import { DownloaderService, VideoCompilerEffectService } from '../../services';
import { VideoCompilerStrategyInterface } from './interfaces';
import { ResolutionDto } from '../../dtos';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as mkdirp from 'mkdirp';
import * as randomstring from 'randomstring';
import { ImageHelper, MathHelper, VideoHelper } from '../../helpers';
import { ImageInfoInterface } from '../../interfaces';
import { PebEffect } from '@pe/builder-core';
import ErrnoException = NodeJS.ErrnoException;

@Injectable()
@ServiceTag(ServiceTagEnum.VIDEO_COMPILER)
export class AddFramesVideoStrategy implements VideoCompilerStrategyInterface {
  public readonly type: VideoCompilerEffectEnum = VideoCompilerEffectEnum.ADD_FRAMES;

  constructor(
    private readonly videoCompilerEffectService: VideoCompilerEffectService,
    private readonly downloaderService: DownloaderService,
    private logger: Logger,
  ) {
  }

  public async runTask(
    folder: string,
    fps: number,
    size: ResolutionDto,
    effect: PebEffect,
  ): Promise<void> {
    this.logger.log('Add frames...');
    const randomName: string = randomstring.generate(7);
    const randomSSFolder: string = `${folder}/${randomName}`;
    mkdirp(randomSSFolder).catch();
    const regexParse: any[] = effect.payload.regex.match(/\%(\d+)d/);
    const pad: number = parseInt(regexParse[1], 10);
    const promise: any[] = [];

    let j: number = 1;
    for (let i: number = effect.payload.start; i <= effect.payload.end; i++) {
      const name: string = MathHelper.pad(i, pad);
      const file: string = effect.payload.regex.replace(regexParse[0], name);
      const saveName: string = MathHelper.pad(j, pad);
      promise.push(this.downloaderService.download(saveName, randomSSFolder, `${effect.target}${file}`));
      j++;
    }

    const data: any[] = await Promise.all(promise);

    await new Promise(async (resolve: (value?: any) => void, reject: (reason?: any) => void)  => {
      const compiler: ffmpeg = ffmpeg(`${randomSSFolder}/${regexParse[0]}.${data[0].extension}`);
      const imageInfo: ImageInfoInterface = await ImageHelper.getImageInfo(data[0].file);
      const filter: any = VideoHelper.generateFilter(imageInfo, fps, size.width, size.height);
      await this.downloaderService.download(`audio`, randomSSFolder, `${effect.payload.audio}`);
      compiler
        .fps(fps)
        .input(`${randomSSFolder}/audio.mp3`)
        .duration(Math.round(j / fps))
        .audioCodec('libmp3lame')
        .videoCodec('libx264')
        .audioBitrate('128k').outputOptions(['-crf 28'])
        .complexFilter(`format=yuv420p,` + filter.join(','))
        .on('end', () => {
          rimraf(randomSSFolder, () => { });
          resolve();
        })
        .on('error', () => {
          reject();
        })
        .save(`${randomSSFolder}.mp4`);
    }).catch((err: Error) => {
      throw err;
    });

    await new Promise(async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      if (!fs.existsSync(`${folder}/result.mp4`)) {
        fs.rename(`${randomSSFolder}.mp4`, `${folder}/result.mp4`, (err: ErrnoException | null) => {
          if (err) {
            throw err;
          } else {
            resolve();
          }
        });
      } else {
        fs.renameSync(`${folder}/result.mp4`, `${randomSSFolder}_result.mp4`);
        ffmpeg()
          .input(`${randomSSFolder}_result.mp4`)
          .input(`${randomSSFolder}.mp4`)
          .audioBitrate('128k').videoCodec('libx264').outputOptions(['-crf 28'])
          .on('end', () => {
            fs.unlinkSync(`${randomSSFolder}.mp4`);
            fs.unlinkSync(`${randomSSFolder}_result.mp4`);
            resolve();
          }).on('error', reject)
          .mergeToFile(`${folder}/result.mp4`, folder);
      }
    }).catch((err: Error) => {
      throw err;
    });
  }
}
