import { Injectable } from '@nestjs/common';

import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';

import { MimeTypesEnum, VideoMimeTypes } from '../../tools/mime-types.enum';

import { CompressorInterface, CompressResult } from '../interfaces';
import { VideoCompressionHelper } from '../helpers';

@Injectable()
@ServiceTag('media-compressor')
export class VideosCompressor implements CompressorInterface {
  public async compress(inputFilePath: string, outputFilePath: string): Promise<CompressResult> {
    return VideoCompressionHelper.compress(inputFilePath, outputFilePath);
  }

  public doesSupport(mimeType: MimeTypesEnum): boolean {
    return VideoMimeTypes.indexOf(mimeType) !== -1;
  }
}
