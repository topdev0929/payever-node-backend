import { Global, Injectable } from '@nestjs/common';

import { MessageBusEventsEnum, AppStatusEnum } from '../enums';
import { AppModel } from '../models';
import { BaseEventsProducer } from './base-events.producer';

@Global()
@Injectable()
export class AppEventsProducer extends BaseEventsProducer {
  public async appCreatedEvent(
    app: AppModel,
  ): Promise<void> {
    if (app.status !== AppStatusEnum.Live) {
      return;
    }

    await this.sendEvent(
      MessageBusEventsEnum.AppCreated,
      app.toObject(),
    );
  }

  public async appUpdatedEvent(
    app: AppModel,
  ): Promise<void> {
    if (app.status !== AppStatusEnum.Live) {
      return;
    }

    await this.sendEvent(
      MessageBusEventsEnum.AppUpdated,
      app.toObject(),
    );
  }

  public async appDeletedEvent(
    app: AppModel,
  ): Promise<void> {
    await this.sendEvent(
      MessageBusEventsEnum.AppDeleted,
      app.toObject(),
    );
  }
}
