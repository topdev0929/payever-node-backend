import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { ServiceTagEnum, VideoCompilerEffectEnum } from '../../enums';
import { DownloaderService, VideoCompilerEffectService } from '../../services';
import { VideoCompilerStrategyInterface } from './interfaces';
import { ResolutionDto } from '../../dtos';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as randomstring from 'randomstring';
import { DownloadResultInterface } from '../../interfaces';
import { PebEffect } from '@pe/builder-core';

@Injectable()
@ServiceTag(ServiceTagEnum.VIDEO_COMPILER)
export class ImageOverlayVideoStrategy implements VideoCompilerStrategyInterface {
  public readonly type: VideoCompilerEffectEnum = VideoCompilerEffectEnum.IMAGE_OVERLAY;

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
    this.logger.log('Image Overlay...');
    const randomTempFile: string = randomstring.generate(7);
    const downloadResult: DownloadResultInterface =
      await this.downloaderService.download(randomTempFile, folder, effect.target);
    const imageFile: string = downloadResult.file;

    await new Promise(async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      if (!fs.existsSync(`${folder}/result.mp4`)) {
        reject();
      }

      const subCompiler: ffmpeg = ffmpeg();
      subCompiler.input(`${folder}/result.mp4`);
      subCompiler.input(imageFile);
      subCompiler.complexFilter(`overlay=${effect.payload.x}:${effect.payload.y}:
      enable='between(t,${effect.payload.start},${effect.payload.end})'`);
      subCompiler.audioBitrate('128k').videoCodec('libx264').outputOptions(['-crf 28']);
      subCompiler.on('end', resolve).on('error', reject);
      subCompiler.save(`${folder}/${randomTempFile}_compiled.mp4`);
    }).catch((err: Error) => {
      throw err;
    });

    fs.unlinkSync(`${folder}/result.mp4`);
    fs.renameSync(`${folder}/${randomTempFile}_compiled.mp4`, `${folder}/result.mp4`);
    fs.unlinkSync(`${imageFile}`);
  }
}
