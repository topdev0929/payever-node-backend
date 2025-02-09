import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitMqEnum } from '../../environments';

@Injectable()
export class VideoGeneratorMessagesProducer {

  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private logger: Logger,
  ) { }

  public async generateVideoFinished(video: string, businessId?: string): Promise<void> {
    this.logger.log(`Generate Video Finished ${RabbitMqEnum.GenerateVideoFinished} event`);
    await this.rabbitClient
      .send(
        {
          channel: RabbitMqEnum.GenerateVideoFinished,
          exchange: 'async_events',
        },
        {
          name: RabbitMqEnum.GenerateVideoFinished,
          payload: {
            businessId: businessId,
            video: video,
          },
        },
      );
  }
}
