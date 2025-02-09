import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ImageCompilerDto } from '../dtos';
import { ImageCompilerService } from '../services';
import { MediaUploadResultInterface } from '../interfaces';
import { MessagePattern } from '@nestjs/microservices';
import { MediaCompiledProducer } from '.././producers';
import { MediaTypeEnum, EventEnum } from '../enums';

@Controller('image')
@ApiTags('Image Compiler API')
export class ImageCompilerController {
  constructor(
    private readonly imageCompilerService: ImageCompilerService,
    private readonly mediaCompiledProducer: MediaCompiledProducer,
  ) { }

  @Post('/compile')
  public async imageCompile(
    @Body() body: ImageCompilerDto,
  ): Promise<MediaUploadResultInterface> {
    return this.imageCompilerService.execute(body);
  }

  @MessagePattern({
    name: EventEnum.CompilerImage,
  })
  public async onCompilerImage(body: ImageCompilerDto): Promise<void> {
    const media: MediaUploadResultInterface = await this.imageCompilerService.execute(body);
    await this.mediaCompiledProducer.MediaCompiled(media, body.business, MediaTypeEnum.IMAGE);
  }
}
