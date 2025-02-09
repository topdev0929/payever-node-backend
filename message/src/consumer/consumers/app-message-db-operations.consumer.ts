import { Controller, Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Subscribe, Payload } from '@pe/stomp-client';
import { RabbitChannelsEnum } from '../../message/enums';
import { StompTopicsEnum } from '../enums';
import { MessagesDbWriterService } from '../../message/submodules/platform/services/messages-db-writer.service';
import { MessageModelDbOperationDto } from '../../message/dto/message-db-writer';
import { environment } from '../../environments';

@Injectable()
@Controller()
export class AppMessageDbOperationsConsumer {
  constructor(
    private readonly messagesDbWriterService: MessagesDbWriterService,
  ) { }

  @Subscribe({
    prefetchCount: environment.dbConsumerPrefetchCount,
    queue: `/queue/${StompTopicsEnum.MessageMessageModelDbOperation}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.MessageMessageModelDbOperation,
  })
  public async create(
    @Payload('json') dto: MessageModelDbOperationDto,
  ): Promise<void> {
    await this.messagesDbWriterService.performDbOperation(dto);
  }
}
