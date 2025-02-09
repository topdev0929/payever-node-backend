import { RabbitMqClient } from '@pe/nest-kit';
import { ShippingZoneModel } from '../models';
import { RabbitEventNameEnum } from '../../environments/rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShippingZoneEventsProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async produceZoneUpdatedEvent(zone: ShippingZoneModel, businessId: string): Promise<void> {
    await this.produceZoneEvent(RabbitEventNameEnum.ShippingZoneUpdated, zone, businessId);
  }

  public async produceZoneExportedEvent(zone: ShippingZoneModel, businessId: string): Promise<void> {
    await this.produceZoneEvent(RabbitEventNameEnum.ShippingZoneExported, zone, businessId);
  }

  public async produceZoneCreatedEvent(zone: ShippingZoneModel, businessId: string): Promise<void> {
    await this.produceZoneEvent(RabbitEventNameEnum.ShippingZoneCreated, zone, businessId);
  }

  public async produceZoneRemovedEvent(zone: ShippingZoneModel, businessId: string): Promise<void> {
    await this.produceZoneEvent(RabbitEventNameEnum.ShippingZoneRemoved, zone, businessId);
  }

  public produceZoneEvent(eventName: RabbitEventNameEnum, zone: ShippingZoneModel, businessId: string): Promise<void> {

    if (!zone) {
      return;
    }

    const payload: any = {
      businessId: businessId,
      countryCodes: zone.countryCodes,
      id: zone._id,
      name: zone.name,
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
