import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VideoCompilerDto } from '../dtos';
import { VideoCompilerService } from '../services';
import { MediaUploadResultInterface } from '../interfaces';
import { MessagePattern } from '@nestjs/microservices';
import { MediaCompiledProducer } from '.././producers';
import { MediaTypeEnum, EventEnum } from '../enums';

@Controller('video')
@ApiTags('Video Compiler API')
export class VideoCompilerController {
  constructor(
    private readonly videoCompilerService: VideoCompilerService,
    private readonly mediaCompiledProducer: MediaCompiledProducer,
  ) { }

  @Post('/compile')
  public async VideoCompile(
    @Body() body: VideoCompilerDto,
  ): Promise<MediaUploadResultInterface> {
    return this.videoCompilerService.execute(body);
  }

  @MessagePattern({
    name: EventEnum.CompilerVideo,
  })
  public async onCompilerImage(body: VideoCompilerDto): Promise<void> {
    const media: MediaUploadResultInterface = await this.videoCompilerService.execute(body);
    await this.mediaCompiledProducer.MediaCompiled(media, body.business, MediaTypeEnum.VIDEO);
  }
}
