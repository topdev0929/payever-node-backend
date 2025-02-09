import { Global, Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { plainToClass } from 'class-transformer';
import { MessageBusEventsEnum } from '../enum';
import { ApiCallModel } from '../models';
import { ApiCallCreatedDto } from '../dto';
import { CheckoutModel } from '../../checkout/models';
import { CheckoutPayloadInterface } from '../../checkout/interfaces';
import { ChannelSetModel } from '../../channel-set/models';
import { ChannelSetSchemaName } from '../../mongoose-schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { IntegrationModel } from '../../integration/models';

@Global()
@Injectable()
export class RabbitEventsProducer {
  constructor(
    @InjectModel(ChannelSetSchemaName) private readonly channelSetModel: Model<ChannelSetModel>,
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async sendApiCallEvent(
    name:
      MessageBusEventsEnum.apiCallCreated |
      MessageBusEventsEnum.apiCallUpdated |
      MessageBusEventsEnum.apiCallMigrate,
    apiCall: ApiCallModel,
  ): Promise<void> {
    await this.sendEvent(
      name,
      {
        id: apiCall.id,
        ...plainToClass<ApiCallCreatedDto, ApiCallModel>(
          ApiCallCreatedDto,
          apiCall,
        ),
      },
    );
  }

  public async sendFlowEvent(
    name:
      MessageBusEventsEnum.flowCreated |
      MessageBusEventsEnum.flowUpdated,
    payload: any,
  ): Promise<void> {
    await this.sendEvent(
      name,
      payload,
    );
  }

  public async sendScheduledTaskEvent(
    payload: any,
  ): Promise<void> {
    await this.sendEvent(
      MessageBusEventsEnum.scheduledTaskExecute,
      payload,
    );
  }

  public async sendScheduledPaymentActionEvent(
    payload: any,
  ): Promise<void> {
    await this.sendEvent(
      MessageBusEventsEnum.scheduledPaymentActionRun,
      payload,
    );
  }

  public async businessCheckoutCreated(checkout: CheckoutModel): Promise<void> {
    await this.sendEvent(
      MessageBusEventsEnum.CheckoutCreated,
      await this.prepareCheckoutEventPayload(checkout),
    );
  }

  public async businessCheckoutUpdated(checkout: CheckoutModel): Promise<void> {
    await this.sendEvent(
      MessageBusEventsEnum.CheckoutUpdated,
      await this.prepareCheckoutEventPayload(checkout),
    );
  }

  public async businessCheckoutExport(checkout: CheckoutModel): Promise<void> {
    await this.sendEvent(
      MessageBusEventsEnum.CheckoutExport,
      await this.prepareCheckoutEventPayload(checkout),
    );
  }

  public async businessCheckoutChannelSetExport(checkout: CheckoutModel): Promise<void> {
    await this.sendEvent(
      MessageBusEventsEnum.CheckoutChannelSetExport,
      await this.prepareCheckoutEventPayload(checkout),
    );
  }

  public async businessCheckoutRemoved(business: BusinessModel, checkout: CheckoutModel): Promise<void> {
    await this.sendEvent(
      MessageBusEventsEnum.CheckoutRemoved,
      {
        businessId: business.id,
        checkoutId: checkout.id,
      },
    );
  }

  public async checkoutIntegrationEnabled(
    integration: IntegrationModel,
    checkout: CheckoutModel,
  ): Promise<void> {
    checkout.depopulate('');

    await this.sendEvent(
      MessageBusEventsEnum.CheckoutIntegrationEnabled,
      {
        checkout,
        integration,
      },
    );
  }

  public async checkoutIntegrationDisabled(
    integration: IntegrationModel,
    checkout: CheckoutModel,
  ): Promise<void> {
    checkout.depopulate('');

    await this.sendEvent(
      MessageBusEventsEnum.CheckoutIntegrationDisabled,
      {
        checkout,
        integration,
      },
    );
  }

  private async prepareCheckoutEventPayload(checkout: CheckoutModel): Promise<CheckoutPayloadInterface> {
    const linkChannelSet: ChannelSetModel =
      await this.channelSetModel.findOne({ type: 'link', checkout: checkout.id});

    return {
      businessId: checkout.businessId,
      checkoutId: checkout.id,
      linkChannelSetId: linkChannelSet?.id,
      ...checkout.toObject(),
      cspAllowedHosts: checkout.settings ? checkout.settings.cspAllowedHosts : [],
    };
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
