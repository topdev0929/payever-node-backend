import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit/modules/command';
import * as os from 'os';
import * as path from 'path';
import { sync } from 'mime-kind';

import { ImagesStorage } from '../services';
import { BlobThumbnailBlurDto } from '../dto';
import { MediaContainersEnum } from '@pe/media-sdk';
import { appendFileAsync, existsAsync, mkdirAsync, readdirAsync, readFileAsync } from '../../tools';

@Injectable()
export class GenerateWallpapersCommand {
  private logger: Logger = new Logger(GenerateWallpapersCommand.name, true);

  constructor(
    private readonly imagesStorage: ImagesStorage,
  ) { }

  @Command({ command: 'wallpapers:generate', describe: 'Generate images to upload into Azure for wallpapers' })
  public async generateWallpapers(): Promise<void> {
    const containerName: MediaContainersEnum = MediaContainersEnum.Wallpapers;
    const inPath: string = path.join(process.cwd(), 'images', 'wallpapers', 'input');
    const outPath: string = path.join(process.cwd(), 'images', 'wallpapers', 'output');

    if (!await existsAsync(outPath)) {
      await mkdirAsync(outPath);
    }

    const files: string[] = await readdirAsync(inPath);
    let i: number = 0;

    for (const fileName of files) {
      const file: Buffer = await readFileAsync(path.join(inPath, fileName));
      const mimetype: { mime: string} = sync(file);
      const blobThumbnailBlurDto: BlobThumbnailBlurDto = new BlobThumbnailBlurDto();

      const wallpaperBlobNames: string[] = await Promise.all(
        await this.imagesStorage.createBlobsWithThumbnailAndBlur(
          containerName,
          {
            buffer: file,
            mimetype: mimetype.mime,
            originalname: fileName,
          },
          blobThumbnailBlurDto,
        ),
      );
      await appendFileAsync(
        path.join(outPath, 'out.log'),
        `>>Processed File: ${fileName}. Created files: ${wallpaperBlobNames.join(' ,')}${os.EOL}`);
      i++;

      this.logger.log(`Processed ${i} of ${files.length}`);
    }
  }
}
