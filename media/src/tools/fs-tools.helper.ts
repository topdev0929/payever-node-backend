// tslint:disable: typedef
import { promisify } from 'util';
import * as child_processs from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

import { v4 as uuid } from 'uuid';
import * as rimraf from 'rimraf';

export const writeFileAsync = promisify(fs.writeFile);
export const readFileAsync = promisify(fs.readFile);
export const unlinkAsync = promisify(fs.unlink);
export const existsAsync = promisify(fs.exists);
export const mkdirAsync = promisify(fs.mkdir);
export const appendFileAsync = promisify(fs.appendFile);
export const readdirAsync = promisify(fs.readdir);
export const statAsync = promisify(fs.stat);
export const copyFileAsync = promisify(fs.copyFile);
export const execAsync = promisify(child_processs.exec);

export async function getTmpWorkDir(): Promise<string> {
  const tmpWorkDirName: string = uuid();
  const tmpWorkDirPath: string = path.join(os.tmpdir(), tmpWorkDirName);

  await mkdirAsync(tmpWorkDirPath);

  return tmpWorkDirPath;
}

export function getTmpFilePath(atFolder: string): string {
  const tmpFileName: string = uuid();

  return path.join(atFolder, tmpFileName);
}

export async function getFileSize(filePath: string): Promise<number> {
  return (await statAsync(filePath)).size;
}

export function readFirstChunk(filePath: string, chunkSize: number = 64 * 1024): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.open(filePath, 'r', (openError, fd) => {
      if (openError) { return reject(openError); }
      fs.read(fd, Buffer.alloc(chunkSize), 0, chunkSize, 0, (readError, read, buffer) => {
        if (readError) { return reject(readError); }
        resolve(buffer);
        fs.close(fd, () => { });
      });
    });
  });
}

export async function withFolder<T>(callback: (folder: string) => Promise<T>): Promise<T> {
  const tmpFolder = await getTmpWorkDir();
  try {
    return await callback(tmpFolder);
  } finally {
    rimraf(tmpFolder, () => { });
  }
}

export async function detectMimeTypeNative(firstChunk: Buffer): Promise<string> {
  return withFolder(async (tmpFolder: string) => {
    const tmpPath: string = getTmpFilePath(tmpFolder);
    await writeFileAsync(tmpPath, firstChunk);
    const result: {
      stdout: string;
      stderr: string;
    } = await execAsync(
      [
        'file',
        '--mime-type',
        '--brief',
        tmpPath,
      ].join(' '),
    );

    const mime: string = result.stdout.split('\n')[0];
    if (!mime) { throw new Error(); }

    return mime;
  });
}
