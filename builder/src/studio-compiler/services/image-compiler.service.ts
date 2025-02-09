import { Injectable } from '@nestjs/common';
import { ImageCompilerDto } from '../dtos';
import * as os from 'os';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import * as randomstring from 'randomstring';
import { ImageCompilerEffectService } from './image-compiler-effect.service';
import { DownloaderService } from './downloader.service';
import { MediaUploadService } from './media-upload.service';
import { CompileResultInterface, DownloadResultInterface, MediaUploadResultInterface } from '../interfaces';
import * as fs from 'fs';
import { MediaTypeEnum } from '../enums';
import { CompressImageService } from './compress-image.service';
import { PebAction } from '@pe/builder-core';

@Injectable()
export class ImageCompilerService {
  constructor(
    private readonly downloaderService: DownloaderService,
    private readonly imageCompilerEffectService: ImageCompilerEffectService,
    private readonly mediaUploadService: MediaUploadService,
    private readonly compressImageService: CompressImageService,
  ) {
  }

  public async compile(
    dto: PebAction,
  ): Promise<CompileResultInterface> {
    const randomTempFolder: string = `${os.tmpdir()}/builder-studio/${randomstring.generate(7)}`;
    const randomName: string = randomstring.generate(7);
    await mkdirp(randomTempFolder);
    const downloadResult: DownloadResultInterface =
      await this.downloaderService.download(randomName, randomTempFolder, dto.effects[0].target);
    const file: string = downloadResult.file;

    await this.imageCompilerEffectService.compile(file, dto.effects);

    return {
      file: file,
      folder: randomTempFolder,
    };
  }

  public async execute(
    dto: ImageCompilerDto,
  ): Promise<MediaUploadResultInterface> {
    const compileResult: CompileResultInterface = await this.compile(dto);

    await this.compressImageService.compress(compileResult.folder);

    const media: any = fs.readFileSync(compileResult.file);
    const upload: MediaUploadResultInterface =
      await this.mediaUploadService.uploadMedia(media, dto.business, MediaTypeEnum.IMAGE);
    rimraf(compileResult.folder, () => { });

    return upload;
  }

}
