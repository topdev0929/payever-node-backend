import { PipeTransform, ArgumentMetadata, NotImplementedException } from '@nestjs/common';

import { scan, NodeClamScanResult, InfectedException } from '../../clam';
import { FsFile, MemFile, StreamFile } from '../../media';
import { FilesDecoratorParams } from '../decorators';

export const clamScanFilePipe: PipeTransform = {
  async transform<T extends FsFile | MemFile | StreamFile>(
    value: T[],
    metadata: ArgumentMetadata,
  ): Promise<T[]> {
    const params: FilesDecoratorParams = metadata.data as unknown as FilesDecoratorParams;
    if (params.storeType === 'fs') {
      for (const file of value as FsFile[]) {
        const scanResult: NodeClamScanResult = await scan(file.localPath);
        if (scanResult.isInfected) {
          throw new InfectedException(scanResult);
        }
      }
    } else if (params.storeType === 'memory') {
      for (const file of value as MemFile[]) {
        const scanResult: NodeClamScanResult = await scan(file.buffer);
        if (scanResult.isInfected) {
          throw new InfectedException(scanResult);
        }
      }
    } else if (params.storeType === 'stream') {
      throw new NotImplementedException();
    }

    return value;
  },
};
