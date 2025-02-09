import * as fs from 'fs';
import * as splitFile from 'split-file';
import { File } from '../interfaces';
 
export class SplitFileHelper {
  public static async splitFileBySize(filePath: string, randomOutTempFolder: string): Promise<File[]> {
    const paths: string[] = await splitFile
      .splitFileBySize(filePath, 2560000, randomOutTempFolder);

    const result: File[] = [];
    for (const path of paths) {
      const buffer: Buffer = await SplitFileHelper.stream2buffer(fs.createReadStream(path));
      result.push({
        buffer,
        mimetype: 'video/mp4',
      } as File);
    }

    return result;
  }

  private static async stream2buffer(stream: any): Promise<Buffer> {
    return new Promise < Buffer > ((resolve: any, reject: any) => {     
        const _buf: any[] = Array < any > ();
        stream.on('data', (chunk: any) => _buf.push((chunk)));
        stream.on('end', () => resolve(Buffer.concat(_buf)));
        stream.on('error', (err: any) => reject(`error converting stream - ${err}`));
    });
  }
}
