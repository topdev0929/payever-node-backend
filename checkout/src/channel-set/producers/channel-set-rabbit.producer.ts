import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { BusinessModel } from '../../business';
import { CheckoutModel } from '../../checkout';
import { RabbitBinding } from '../../environments';
import { ChannelSetModel } from '../models';

@Injectable()
export class ChannelSetRabbitProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async checkoutLinkedToChannelSet(checkout: CheckoutModel, channelSet: ChannelSetModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitBinding.CheckoutLinkedToChannelSet,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.CheckoutLinkedToChannelSet,
        payload: {
          channelSetId: channelSet.id,
          checkoutId: checkout.id,
        },
      },
    );
  }

  public async channelSetUnlinked(checkout: CheckoutModel, channelSet: ChannelSetModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitBinding.ChannelSetUnlinked,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.ChannelSetUnlinked,
        payload: {
          channelSet: {
            id: channelSet.id,
          },
          checkout: {
            id: checkout.id,
          },
        },
      },
    );
  }

  public async channelSetByBusinessExportMessage(business: BusinessModel, channelSet: ChannelSetModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitBinding.ChannelSetByBusinessExport,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.ChannelSetByBusinessExport,
        payload: {
          business: {
            id: business.id,
          },
          channel: {
            type: channelSet.type ? channelSet.type : '',
          },
          id: channelSet.id,
        },
      },
    );
  }
}
