import { RabbitMqClient } from '@pe/nest-kit';
import { ShippingSettingModel } from '../models';
import { RabbitEventNameEnum } from '../../environments/rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShippingSettingEventsProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async produceSettingUpdatedEvent(setting: ShippingSettingModel): Promise<void> {
    await this.produceSettingEvent(RabbitEventNameEnum.ShippingSettingUpdated, setting);
  }

  public async produceSettingExportedEvent(setting: ShippingSettingModel): Promise<void> {
    await this.produceSettingEvent(RabbitEventNameEnum.ShippingSettingExported, setting);
  }

  public async produceSettingCreatedEvent(setting: ShippingSettingModel): Promise<void> {
    await this.produceSettingEvent(RabbitEventNameEnum.ShippingSettingCreated, setting);
  }

  public async produceSettingRemovedEvent(setting: ShippingSettingModel): Promise<void> {
    await this.produceSettingEvent(RabbitEventNameEnum.ShippingSettingRemoved, setting);
  }

  public produceSettingEvent(eventName: RabbitEventNameEnum, setting: ShippingSettingModel): Promise<void> {
    const payload: any = {
      businessId: setting.businessId,
      id: setting._id,
      name: setting.name,
      zones: setting.zones,
    };

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
