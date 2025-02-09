import { Module } from '@nestjs/common';

import { ImagesCompressor, MediaCompressorWrapper, VideosCompressor } from './services';

@Module({
  exports: [
    MediaCompressorWrapper,
  ],
  providers: [
    MediaCompressorWrapper,
    VideosCompressor,
    ImagesCompressor,
  ],
})
export class CompressorModule { }
