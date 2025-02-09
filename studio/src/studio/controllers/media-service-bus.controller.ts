import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StudioImagesUploadedDto, StudioImagesUploadedErrorDto } from '../dto';
import { StudioMediasUploadedService } from '../services';
import { RabbitMqEnum } from '../../environments';
import { RabbitChannelsEnum } from '../enums';

@Controller()
export class MediaServiceBusController {
  constructor(
    private readonly studioMediasUploadedService: StudioMediasUploadedService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Studio,
    name: RabbitMqEnum.StudioMediasUploaded,
  })
  public async onStudioImagesUploaded(studioImagesUploadedDto: StudioImagesUploadedDto): Promise<void> {
    await this.studioMediasUploadedService.saveUploadMedia(studioImagesUploadedDto);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Studio,
    name: RabbitMqEnum.StudioMediasUploadedError,
  })
  public async onStudioImagesUploadedError(studioImagesUploadedErrorDto: StudioImagesUploadedErrorDto): Promise<void> {
    await this.studioMediasUploadedService.saveMediaUploadError(studioImagesUploadedErrorDto);
  }
}
