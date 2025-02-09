import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { ServiceTagEnum, VideoCompilerEffectEnum } from '../../enums';
import { DownloaderService, VideoCompilerEffectService } from '../../services';
import { VideoCompilerStrategyInterface } from './interfaces';
import { ResolutionDto } from '../../dtos';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as randomstring from 'randomstring';
import { VideoHelper } from '../../helpers';
import { DownloadResultInterface } from '../../interfaces';
import { PebEffect } from '@pe/builder-core';
import ErrnoException = NodeJS.ErrnoException;

@Injectable()
@ServiceTag(ServiceTagEnum.VIDEO_COMPILER)
export class AddVideoStrategy implements VideoCompilerStrategyInterface {
  public readonly type: VideoCompilerEffectEnum = VideoCompilerEffectEnum.ADD_VIDEO;

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
    this.logger.log('Add...');
    const randomTempFile: string = randomstring.generate(7);
    const downloadResult: DownloadResultInterface =
      await this.downloaderService.download(randomTempFile, folder, effect.target);
    const file: string = downloadResult.file;
    const videoInfo: any = await VideoHelper.getVideoInfo(file);
    const filter: any = VideoHelper.generateFilter(videoInfo, fps, size.width, size.height);

    await this.compiler(file, folder, randomTempFile, effect, filter);
    await this.mergeResult(file, folder, randomTempFile);
  }

  private async compiler(
    file: string,
    folder: string,
    randomTempFile: string,
    effect: PebEffect,
    filter: any,
  ): Promise<void> {
    await new Promise(async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      const subCompiler: ffmpeg = ffmpeg();
      subCompiler.input(file);
      subCompiler.complexFilter([filter.join(',')]);
      if (effect.payload) {
        if (effect.payload.start) {
          subCompiler.seekInput(effect.payload.start);
        }
        if (effect.payload.duration) {
          subCompiler.duration(effect.payload.duration);
        }
      }
      subCompiler.audioBitrate('128k').videoCodec('libx264').outputOptions(['-crf 28']);
      subCompiler.on('end', resolve).on('error', reject);
      subCompiler.save(`${folder}/${randomTempFile}_compiled.mp4`);
    }).catch((err: Error) => {
      throw err;
    });
  }

  private async mergeResult(
    file: string,
    folder: string,
    randomTempFile: string,
  ): Promise<void> {
    await new Promise(async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      if (!fs.existsSync(`${folder}/result.mp4`)) {
        fs.rename(`${folder}/${randomTempFile}_compiled.mp4`, `${folder}/result.mp4`, (err: ErrnoException | null) => {
          if (err) {
            throw err;
          } else {
            resolve();
          }
        });
      } else {
        fs.renameSync(`${folder}/result.mp4`, `${folder}/${randomTempFile}_result.mp4`);
        ffmpeg()
          .input(`${folder}/${randomTempFile}_result.mp4`)
          .input(`${folder}/${randomTempFile}_compiled.mp4`)
          .audioBitrate('128k').videoCodec('libx264').outputOptions(['-crf 28'])
          .on('end', () => {
            fs.unlinkSync(`${file}`);
            fs.unlinkSync(`${folder}/${randomTempFile}_result.mp4`);
            fs.unlinkSync(`${folder}/${randomTempFile}_compiled.mp4`);
            resolve();
          }).on('error', reject)
          .mergeToFile(`${folder}/result.mp4`, folder);
      }
    }).catch((err: Error) => {
      throw err;
    });
  }
}
