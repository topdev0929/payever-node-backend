import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import {
  ConsumerEventsEnum, ConnectionEventsProducer,
  BusinessModel, IntegrationModel, ConnectionModel,
} from '@pe/third-party-sdk';

const BUSINESS_ID: string = '80a7526d-ea00-4503-b513-039408501881';

@Injectable()
export class ThirdPartyMessagesMock extends AbstractMessageMock {

  @PactRabbitMqMessageProvider(ConsumerEventsEnum.IntegrationConnected)
  public async mockThirdPartyAuthEnabled(): Promise<void> {

    const businessModel: BusinessModel = {
      id: BUSINESS_ID,
    } as BusinessModel;

    const integrationModel: IntegrationModel = {
      id: BUSINESS_ID,
    } as IntegrationModel;

    const connectionModel: ConnectionModel = {
      business: businessModel,
      integration: integrationModel,
    } as ConnectionModel;

    const producer: ConnectionEventsProducer =
      await this.getProvider<ConnectionEventsProducer>(ConnectionEventsProducer);

    await producer.sendConnectionStatusEvent(
      ConsumerEventsEnum.IntegrationConnected,
      businessModel,
      integrationModel,
      connectionModel,
    );
  }

  @PactRabbitMqMessageProvider(ConsumerEventsEnum.IntegrationDisconnected)
  public async mockThirdPartyAuthDisabled(): Promise<void> {

    const businessModel: BusinessModel = {
      id: BUSINESS_ID,
    } as BusinessModel;

    const integrationModel: IntegrationModel = {
      id: BUSINESS_ID,
    } as IntegrationModel;

    const connectionModel: ConnectionModel = {
      business: businessModel,
      integration: integrationModel,
    } as ConnectionModel;

    const producer: ConnectionEventsProducer =
      await this.getProvider<ConnectionEventsProducer>(ConnectionEventsProducer);

    await producer.sendConnectionStatusEvent(
      ConsumerEventsEnum.IntegrationDisconnected,
      businessModel,
      integrationModel,
      connectionModel,
    );
  }
}
