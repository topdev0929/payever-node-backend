import { Injectable } from '@nestjs/common';
import { VideoCompilerDto } from '../dtos';
import * as os from 'os';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import * as randomstring from 'randomstring';
import { VideoCompilerEffectService } from './video-compiler-effect.service';
import { DownloaderService } from './downloader.service';
import { MediaUploadService } from './media-upload.service';
import { CompileResultInterface, MediaUploadResultInterface, VideoPebActionInterface } from '../interfaces';
import * as fs from 'fs';
import { MediaTypeEnum } from '../enums';

@Injectable()
export class VideoCompilerService {
  constructor(
    private readonly downloaderService: DownloaderService,
    private readonly videoCompilerEffectService: VideoCompilerEffectService,
    private readonly mediaUploadService: MediaUploadService,
  ) {
  }

  public async compile(
    dto: VideoPebActionInterface,
  ): Promise<CompileResultInterface> {
    const randomTempFolder: string = `${os.tmpdir()}/builder-studio/${randomstring.generate(7)}`;
    await mkdirp(randomTempFolder);
    const fps: number = dto.fps ? (dto.fps > 25 ? dto.fps : 25) : 30;
    await this.videoCompilerEffectService.compile(randomTempFolder, fps, dto.size, dto.effects);

    return {
      file: `${randomTempFolder}/result.mp4`,
      folder: randomTempFolder,
    };
  }

  public async execute(
    dto: VideoCompilerDto,
  ): Promise<MediaUploadResultInterface> {

    const compileResult: CompileResultInterface = await this.compile(dto);

    const media: any = fs.readFileSync(compileResult.file);
    const upload: MediaUploadResultInterface =
      await this.mediaUploadService.uploadMedia(media, dto.business, MediaTypeEnum.VIDEO);
    rimraf(compileResult.folder, ( ) => { });

    return upload;
  }

}
