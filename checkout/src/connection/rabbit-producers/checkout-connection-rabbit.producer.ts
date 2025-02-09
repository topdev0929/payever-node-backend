import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { CheckoutModel } from '../../checkout/models';
import { RabbitBinding } from '../../environments';
import { IntegrationModel } from '../../integration';
import { ConnectionModel } from '../models';

@Injectable()
export class CheckoutConnectionRabbitProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async checkoutConnectionInstalled(
    connection: ConnectionModel,
    checkout: CheckoutModel,
  ): Promise<void> {
    await connection.populate('integration').execPopulate();
    const integration: IntegrationModel = connection.integration;

    checkout.depopulate('');
    connection.depopulate('');

    return this.rabbitClient.send(
      {
        channel: RabbitBinding.CheckoutConnectionInstalled,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.CheckoutConnectionInstalled,
        payload: {
          checkout,
          connection,
          integration,
        },
      },
    );
  }

  public async checkoutConnectionUninstalled(
    connection: ConnectionModel,
    checkout: CheckoutModel,
  ): Promise<void> {
    await connection.populate('integration').execPopulate();
    const integration: IntegrationModel = connection.integration;

    checkout.depopulate('');
    connection.depopulate('');

    return this.rabbitClient.send(
      {
        channel: RabbitBinding.CheckoutConnectionUninstalled,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.CheckoutConnectionUninstalled,
        payload: {
          checkout,
          connection,
          integration,
        },
      },
    );
  }
}
