import { Module } from '@nestjs/common';

import { CompressorModule } from '../compressor';

import { EncoderConsumer } from './consumers';
import { StorageModule } from '../storage';

@Module({
  controllers: [
    EncoderConsumer,
  ],
  imports: [
    CompressorModule,
    StorageModule,
  ],
})
export class AsyncEncoderModule { }
