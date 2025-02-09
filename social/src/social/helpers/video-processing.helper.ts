import { Logger } from '@nestjs/common';
import { File } from '../interfaces';
import * as ffmpeg from 'fluent-ffmpeg';
import { Writable } from 'stream';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import * as randomstring from 'randomstring';
import * as rimraf from 'rimraf';
import * as os from 'os';
import * as mkdirp from 'mkdirp';
import { SplitFileHelper } from './split-stream.helper';
import { MimeTypesEnum } from '../enums';

const MP4_FORMAT: string = 'mp4';
const TMP_DIR: string = '/tmp';

export class VideoProcessingHelper {
  public static async uploadScreenShot(file: File): Promise<{
    filePath: string;
    randomTempFolder: string;
    thumbnailSrc: File;
  }> {
    const randomTempFolder: string = `${os.tmpdir()}/video-compiler/${randomstring.generate(7)}`;
    await mkdirp(randomTempFolder);
    const filePath: string = VideoProcessingHelper.createTmpFile(randomTempFolder, file.buffer);

    return {
      filePath,
      randomTempFolder,
      thumbnailSrc: await VideoProcessingHelper.takeScreenshot(filePath),
    };
  }

  public static async splitVideo(filePath: string, tempFolder: string, logger: Logger): Promise<File[]> {
    const randomOutTempFolder: string = `${os.tmpdir()}/video-compiler/${randomstring.generate(7)}`;
    await mkdirp(randomOutTempFolder);
    
    const compressedFilePath: string = VideoProcessingHelper.createTmpFile(
      tempFolder,
      await VideoProcessingHelper.compress(
        filePath, 
        logger,
      ),
    );

    const splitFiles: File[] = await SplitFileHelper.splitFileBySize(compressedFilePath, randomOutTempFolder);

    rimraf(tempFolder, () => { });
    rimraf(randomOutTempFolder, () => { });

    return splitFiles;
  }

  public static async takeScreenshot(tmpFileName: string): Promise<File> {
    return new Promise((resolve: any, reject: any): void => {
      const screenShotName: string = uuid();

      ffmpeg(tmpFileName)
        .screenshot({
          count: 1,
          filename: screenShotName,
          folder: TMP_DIR,
          timestamps: ['1%'],
        })
        .on('end', (): void => {
          resolve({
            buffer: fs.readFileSync(`${TMP_DIR}/${screenShotName}.png`),
            mimeType: MimeTypesEnum.PNG,
            originalName: `${screenShotName}.png`,
          });
        })
        .on('error', (err: any, stdout: any, stderr: any): void => {
          reject(err);
        });
    });
  }

  public static async compress(buffer: string, logger: Logger): Promise<Buffer> {
    return new Promise((resolve: any, reject: any): void => {
      const compressedFileName: string = VideoProcessingHelper.createTmpFile(TMP_DIR);
      const outputStream: Writable = fs.createWriteStream(compressedFileName);

      ffmpeg(buffer)
        .videoCodec('libx264')
        .toFormat(MP4_FORMAT)
        .outputOption('-movflags frag_keyframe+faststart')
        .on('end', (): void => {
          const compressedBuffer: Buffer = fs.readFileSync(compressedFileName);
          resolve(compressedBuffer);
          VideoProcessingHelper.removeTmpFile(compressedFileName);
          VideoProcessingHelper.removeTmpFile(buffer);
        })
        .on('error', (err: any, stdout: any, stderr: any) => {
          logger.log(err);
          VideoProcessingHelper.removeTmpFile(compressedFileName);
          VideoProcessingHelper.removeTmpFile(buffer);
          reject(err);
        })
        .output(outputStream, { end: true})
        .run();
    });
  }

  public static removeTmpFile(tmpName: string): void {
    if (fs.existsSync(tmpName)) {
      fs.unlinkSync(tmpName);
    }
  }

  public static createTmpFile(tmpDir: string, buffer: Buffer = Buffer.alloc(1)): string {
    const tmpFileName: string = `${tmpDir}/${uuid()}`;
    fs.writeFileSync(tmpFileName, buffer);

    return tmpFileName;
  }
}
