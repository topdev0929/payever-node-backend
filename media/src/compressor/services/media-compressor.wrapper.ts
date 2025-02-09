import { Injectable } from '@nestjs/common';

import { Collector } from '@pe/nest-kit';
import { CollectorInterface } from '@pe/nest-kit/modules/collector-pattern/interfaces';

import { MimeTypesEnum } from '../../tools/mime-types.enum';

import { CompressorInterface, CompressResult } from '../interfaces';
import { CompressorNotFoundException } from '../exceptions';

@Injectable()
@Collector('media-compressor')
export class MediaCompressorWrapper implements CollectorInterface {
  protected services: CompressorInterface[] = [];

  public async compress(
    mimeType: MimeTypesEnum,
    inputFilePath: string,
    outputFilePath: string,
  ): Promise<CompressResult> {
    return this.getCompressor(mimeType).compress(inputFilePath, outputFilePath);
  }

  public doesSupport(mimeType: MimeTypesEnum): boolean {
    return !!this.findCompressor(mimeType);
  }

  public addService(service: CompressorInterface): void {
    this.services.push(service);
  }

  private getCompressor(mimeType: MimeTypesEnum): CompressorInterface {
    const compressor: CompressorInterface = this.findCompressor(mimeType);

    if (!compressor) {
      throw new CompressorNotFoundException(mimeType);
    }

    return compressor;
  }

  private findCompressor(mimeType: MimeTypesEnum): CompressorInterface {
    return this.services.find((compressor: CompressorInterface) => compressor.doesSupport(mimeType));
  }
}
