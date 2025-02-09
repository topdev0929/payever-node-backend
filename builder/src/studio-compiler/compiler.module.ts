import { HttpModule, Module } from '@nestjs/common';
import {
  CompressImageService,
  DownloaderService,
  ImageCompilerEffectService,
  ImageCompilerService,
  MediaUploadService,
  VideoCompilerEffectService,
  VideoCompilerService,
} from './services';
import { CollectorModule } from '@pe/nest-kit';
import { ImageCompilerController, VideoCompilerController } from './controllers';
import {
  CompositeStrategy,
  CropStrategy,
  FadeStrategy,
  FlipStrategy,
  GreyscaleStrategy,
  MaskStrategy,
  PrintStrategy,
  ResizeStrategy,
  RotateStrategy,
} from './strategies/image-compiler';
import {
  AddFramesVideoStrategy,
  AddVideoStrategy,
  ImageOverlayVideoStrategy,
  TextOverlayVideoStrategy,
} from './strategies/video-compiler';
import { MediaCompiledProducer } from './producers';

@Module({
  controllers: [
    ImageCompilerController,
    VideoCompilerController,
  ],
  exports: [],
  imports: [
    HttpModule,
    CollectorModule,
  ],
  providers: [
    ImageCompilerService,
    ImageCompilerEffectService,
    ResizeStrategy,
    CropStrategy,
    PrintStrategy,
    CompositeStrategy,
    MaskStrategy,
    FlipStrategy,
    RotateStrategy,
    GreyscaleStrategy,
    FadeStrategy,
    VideoCompilerService,
    VideoCompilerEffectService,
    AddVideoStrategy,
    AddFramesVideoStrategy,
    ImageOverlayVideoStrategy,
    TextOverlayVideoStrategy,
    DownloaderService,
    MediaUploadService,
    CompressImageService,
    MediaCompiledProducer,
  ],
})

export class CompilerModule { }
