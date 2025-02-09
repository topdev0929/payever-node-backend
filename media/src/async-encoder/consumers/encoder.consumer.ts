import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { MediaCompressionRequestDto, MediaRabbitEvents } from '@pe/media-sdk';

import { BlobStorageService } from '../../storage/services';
import { MessageBusChannelsEnum } from '../../media/enums';

@Controller()
export class EncoderConsumer {
  @Inject() private readonly blobStorage: BlobStorageService;

  @MessagePattern({
    channel: MessageBusChannelsEnum.encoder,
    name: MediaRabbitEvents.MediaCompressionRequested,
  })
  public async onMediaCompressionRequested(data: MediaCompressionRequestDto): Promise<void> {
    await this.blobStorage.compressBlob(data.filename, data.container);
  }
}
