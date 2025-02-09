import { Injectable, Logger } from '@nestjs/common';
import { FoldersEventsEnum } from '@pe/folders-plugin';

import { EventDispatcher, RabbitMqClient } from '@pe/nest-kit';
import { CouponEventNamesEnum } from '../enum';
import { CouponDocument } from '../schemas';

const context: string = 'EventProducer';

interface Payload {
  coupon: CouponDocument;
}

@Injectable()
export class CouponEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  public async produceCouponCreated(
    coupon: CouponDocument,
  ): Promise<void> {
    return this.produceCommonEvent(coupon, CouponEventNamesEnum.CREATED);
  }
  public async produceCouponDeleted(
    coupon: CouponDocument,
  ): Promise<void> {
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionDeleteDocument, coupon._id);

    return this.produceCommonEvent(coupon, CouponEventNamesEnum.DELETED);
  }
  public async produceCouponExported(
    coupon: CouponDocument,
  ): Promise<void> {
    return this.produceCommonEvent(coupon, CouponEventNamesEnum.EXPORTED);
  }

  public async produceApplicationInstalled(): Promise<void> {
    // app-registry.event.application.installed | Event produced when coupon app installed
  }
  public async produceApplicationUninstalled(): Promise<void> {
    // app-registry.event.application.uninstalled | Event produced when coupon app uninstalled
  }

  private async produceCommonEvent(
    coupon: CouponDocument,
    eventName: string,
  ): Promise<void> {
    const payload: Payload = {
      coupon,
    };

    this.logger.log({
      context,
      message: `SENDING '${eventName}' event`,
      payload,
    });
    await this.rabbitClient.send({
      channel: eventName,
      exchange: 'async_events',
    }, { name: eventName, payload });
    this.logger.log({
      context,
      message: `SENT '${eventName}' event`,
      payload,
    });
  }
}
