import { Global, Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { plainToClass } from 'class-transformer';
import { ActionApiCallCreatedDto } from '../dto';
import { MessageBusEventsEnum } from '../enum';
import { ActionApiCallModel } from '../models';

@Global()
@Injectable()
export class LegacyApiEventsProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async sendActionApiCallEvent(
    name: MessageBusEventsEnum.actionApiCallCreated | MessageBusEventsEnum.actionApiCallMigrate,
    actionApiCall: ActionApiCallModel,
  ): Promise<void> {
    await this.sendEvent(
      name,
      {
        id: actionApiCall.id,
        ...plainToClass<ActionApiCallCreatedDto, ActionApiCallModel>(
          ActionApiCallCreatedDto,
          actionApiCall,
        ),
      },
    );
  }

  private async sendEvent(
    eventName: MessageBusEventsEnum,
    payload: { },
  ): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
    );
  }
}
