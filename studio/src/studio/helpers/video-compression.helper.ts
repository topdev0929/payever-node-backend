import * as ffmpeg from 'fluent-ffmpeg';
import { Writable } from 'stream';
import * as fs from 'fs';
import * as os from 'os';
import { v4 as uuid } from 'uuid';

const MP4_FORMAT: string = 'mp4';
const TMP_DIR: string = os.tmpdir();

export class VideoCompressionHelper {
  public static async compress(buffer: Buffer): Promise<Buffer> {
    return new Promise((resolve: any, reject: any): void => {
      const tmpFileName: string = VideoCompressionHelper.createTmpFile(TMP_DIR, buffer);
      const compressedFileName: string = VideoCompressionHelper.createTmpFile(TMP_DIR);

      const outputStream: Writable = fs.createWriteStream(compressedFileName);

      /* tslint:disable:no-dead-store */
      ffmpeg(tmpFileName)
        .videoCodec('libx264')
        .toFormat(MP4_FORMAT)
        .outputOption('-movflags frag_keyframe+faststart')
        .on('end', (): void => {
          const compressedBuffer: Buffer = fs.readFileSync(compressedFileName);
          resolve(compressedBuffer);
          VideoCompressionHelper.removeTmpFile(compressedFileName);
          VideoCompressionHelper.removeTmpFile(tmpFileName);
          buffer = null;
        })
        .on('error', (err: any, stdout: any, stderr: any) => {
          VideoCompressionHelper.removeTmpFile(compressedFileName);
          VideoCompressionHelper.removeTmpFile(tmpFileName);
          reject(err);
          buffer = null;
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

  private static createTmpFile(tmpDir: string, buffer: Buffer = null): string {
    const tmpFileName: string = `${tmpDir}/${uuid()}`;
    fs.writeFileSync(tmpFileName, buffer);

    return tmpFileName;
  }
}
