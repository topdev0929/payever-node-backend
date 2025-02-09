import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { ServiceTagEnum, VideoCompilerEffectEnum } from '../../enums';
import { DownloaderService, VideoCompilerEffectService } from '../../services';
import { VideoCompilerStrategyInterface } from './interfaces';
import { ResolutionDto } from '../../dtos';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as randomstring from 'randomstring';
import { PebEffect } from '@pe/builder-core';

@Injectable()
@ServiceTag(ServiceTagEnum.VIDEO_COMPILER)
export class TextOverlayVideoStrategy implements VideoCompilerStrategyInterface {
  public readonly type: VideoCompilerEffectEnum = VideoCompilerEffectEnum.TEXT_OVERLAY;

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
    this.logger.log('Text Overlay...');
    const randomTempFile: string = randomstring.generate(7);

    await new Promise(async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      if (!fs.existsSync(`${folder}/result.mp4`)) {
        reject();
      }

      const subCompiler: ffmpeg = ffmpeg();
      subCompiler.input(`${folder}/result.mp4`);
      subCompiler.complexFilter(`drawtext=fontfile=./static/Roboto.ttf:text='${effect.target}':
        x=${effect.payload.x}: y=${effect.payload.y}:
        fontcolor=${effect.payload.color}: fontsize=${effect.payload.fontSize}:
        enable='between(t,${effect.payload.start},${effect.payload.end})'`);
      subCompiler.audioBitrate('128k').videoCodec('libx264').outputOptions(['-crf 28']);
      subCompiler.on('end', resolve).on('error', reject);
      subCompiler.save(`${folder}/${randomTempFile}_compiled.mp4`);
    }).catch((err: Error) => {
      throw err;
    });

    fs.unlinkSync(`${folder}/result.mp4`);
    fs.renameSync(`${folder}/${randomTempFile}_compiled.mp4`, `${folder}/result.mp4`);
  }
}
