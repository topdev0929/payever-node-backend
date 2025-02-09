import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { MediaTypeEnum, EventEnum } from '../enums';
import { MediaUploadResultInterface } from '../interfaces';

@Injectable()
export class MediaCompiledProducer {

  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private logger: Logger,
  ) { }


  public async MediaCompiled(
    media: MediaUploadResultInterface,
    businessId: string,
    type: MediaTypeEnum,
  ): Promise<void> {
    const message: string = type === MediaTypeEnum.IMAGE ?
      EventEnum.CompilerResultImage : EventEnum.CompilerResultVideo;
    this.logger.log(`Generate ${type} Finished ${message} event`);
    await this.rabbitClient
      .send(
        {
          channel: message,
          exchange: 'async_events',
        },
        {
          name: message,
          payload: {
            businessId: businessId,
            media: media,
          },
        },
      );
  }
}
