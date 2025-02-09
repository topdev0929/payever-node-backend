import * as NodeClam from 'clamscan';
import * as isStream from 'is-stream';
import { Readable } from 'stream';
import { BadRequestException, HttpException } from '@nestjs/common';
import { getTmpFilePath, withFolder, writeFileAsync } from '../tools';
import { environment } from '../environments';

let instanceInititor: Promise<NodeClam>;

export class InfectedException extends BadRequestException { }

export type NodeClamScanResult = NodeClam.Response<{
  file: string;
  isInfected: boolean;
}>;

async function getInstance(): Promise<NodeClam> {
  if (instanceInititor === undefined) {
    instanceInititor = (new NodeClam()).init({
      clamdscan: {
        host: environment.clamd.host,
        localFallback: false,
        port: environment.clamd.port,
        timeout: 10000,
      },
  
        removeInfected: true,
    });
  }
  
  return instanceInititor;
}

export async function scan(source: string | Buffer | NodeJS.ReadableStream): Promise<NodeClamScanResult> {
  if (!environment.clamd.enabled) {
    return {
      file: null,
      isInfected: false,
      viruses: [],
    };
  }

  let instance: NodeClam = null;
  try {
    instance = await getInstance();
  } catch (ex) {
    throw new HttpException('clamav service unavailable', 503);
  }

  if (typeof source === 'string') {
    try {
      return await instance.scanFile(source);
    } catch (ex) {
      throw new HttpException(`clamav scan failed`, 503);
    }
  } else if (Buffer.isBuffer(source)) {
    return withFolder(async (tmpFolder: string) => {
      const tmpFilePath: string = getTmpFilePath(tmpFolder);
      await writeFileAsync(tmpFilePath, source);
      try {
        return await instance.scanFile(tmpFilePath);
      } catch (ex) {
        throw new HttpException(`clamav scan failed`, 503);
      }
    });
  } else if (isStream(source)) {
    try {
      return await instance.scanStream(source as Readable);
    } catch (ex) {
      throw new HttpException(`clamav scan failed`, 503);
    }
  }

  throw new Error();
}
