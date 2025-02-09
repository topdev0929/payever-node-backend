import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventDispatcher } from '@pe/nest-kit';
import { validate } from 'class-validator';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { RabbitBinding, MessageBusChannelsEnum } from '../../environments';
import { ThirdPartyConnectionChangedDto } from '../../integration/dto';
import { BusinessIntegrationSubModel, IntegrationModel } from '../../integration/models';
import { BusinessIntegrationSubscriptionService, IntegrationService } from '../../integration/services';
import { ConnectionEvent } from '../enums';
import { ConnectionModel } from '../models';
import { ConnectionService } from '../services';

@Controller()
export class ThirdPartyConnectionConsumer {
  constructor(
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly subscriptionService: BusinessIntegrationSubscriptionService,
    private readonly connectionService: ConnectionService,
    private readonly dispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.ThirdPartyConnected,
  })
  public async onThirdPartyConnectedEvent(connectionChangedDto: ThirdPartyConnectionChangedDto): Promise<void> {
    await validate(connectionChangedDto);

    const business: BusinessModel =
      await this.businessService.findOneById(connectionChangedDto.business.id) as BusinessModel;
    if (!business) {
      this.logger.warn({
        dto: connectionChangedDto,
        message: `Business with id "${connectionChangedDto.business.id}" does not exist.`,
      });

      return;
    }

    const integration: IntegrationModel =
      await this.integrationService.findOneByName(connectionChangedDto.integration.name);
    if (!integration) {
      return;
    }

    const subscription: BusinessIntegrationSubModel =
      await this.subscriptionService.findOneByIntegrationAndBusiness(integration, business);
    if (!subscription.installed) {
      this.logger.warn({
        dto: connectionChangedDto,
        message: `Business with id "${business.id}" has no installed integration with name "${integration.name}".`,
      });

      return;
    }

    if (!connectionChangedDto.connection) {
      return;
    }
    
    const connection: ConnectionModel = await this.connectionService.upsert({
      _id: connectionChangedDto.connection.id,
      name: connectionChangedDto.connection.name,
      options: {
        ...connectionChangedDto.connection?.options,
        acceptFee: connectionChangedDto.connection?.options?.merchantCoversFee,
      },

      businessId: business._id,
      integration: integration,
    });

    await this.dispatcher.dispatch(ConnectionEvent.ConnectionCreated, business, integration, connection);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.ThirdPartyDisconnected,
  })
  public async onThirdPartyAuthDisabledEvent(connectionChangedDto: ThirdPartyConnectionChangedDto): Promise<void> {
    await validate(connectionChangedDto);

    const business: BusinessModel =
      await this.businessService.findOneById(connectionChangedDto.business.id) as BusinessModel;
    if (!business) {
      this.logger.warn({
        dto: connectionChangedDto,
        message: `Business with id "${connectionChangedDto.business.id}" does not exist.`,
      });

      return;
    }

    const integration: IntegrationModel =
      await this.integrationService.findOneByName(connectionChangedDto.integration.name);
    if (!integration) {
      return;
    }

    if (!connectionChangedDto.connection) {
      return;
    }
    const connection: ConnectionModel = await this.connectionService.findById(connectionChangedDto.connection.id);
    if (connection) {
      await this.connectionService.removeById(connectionChangedDto.connection.id);
      await this.dispatcher.dispatch(ConnectionEvent.ConnectionRemoved, business, integration, connection);
    }
  }
}
