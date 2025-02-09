import { Injectable } from '@nestjs/common';
import { CompressorInterface, CompressResult } from '../interfaces';
import { MimeTypesEnum, ImageMimeTypes } from '../../tools/mime-types.enum';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { ImageCompressionHelper } from '../helpers';

@Injectable()
@ServiceTag('media-compressor')
export class ImagesCompressor implements CompressorInterface {
  public async compress(inputFilePath: string, outputFilePath: string): Promise<CompressResult> {
    return ImageCompressionHelper.compress(inputFilePath, outputFilePath);
  }

  public doesSupport(mimeType: MimeTypesEnum): boolean {
    return ImageMimeTypes.indexOf(mimeType) !== -1;
  }
}
