import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { EventDispatcher } from '@pe/nest-kit';
import { BusinessMessagesEnum, BusinessDto } from '@pe/business-kit';
import { InternalEventCodesEnum } from '../../common';
import { RabbitChannelsEnum } from '../../message/enums';

@Controller()
export class BusinessConsumer {
  constructor(
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: BusinessMessagesEnum.BusinessCreated,
  })
  public async onBusinessCreated(
    dto: BusinessDto,
  ): Promise<void> {
    this.logger.debug({
      context: 'BusinessConsumer.onBusinessCreated',

      dto,
    });

    await this.eventDispatcher.dispatch(InternalEventCodesEnum.MessageAppInstalled, dto);
  }
}
