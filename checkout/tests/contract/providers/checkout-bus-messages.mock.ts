/* eslint-disable @typescript-eslint/tslint/config */
import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { CheckoutModel } from '../../../src/checkout';
import { BusinessModel } from '../../../src/business';
import { IntegrationModel } from '../../../src/integration';
import { MessageBusEventsEnum } from '../../../src/common/enum';
import { RabbitEventsProducer } from '../../../src/common/producer';

@Injectable()
export class CheckoutRabbitMessagesMock extends AbstractMessageMock {
  private business: BusinessModel = { id: uuid.v4() } as BusinessModel;
  private checkout: CheckoutModel = {
    businessId: uuid.v4(),
    id: uuid.v4(),
    depopulate: (): any => {
      return { };
    },
    toObject: (): any => {
      return {
        settings: {
          cspAllowedHosts: ['host1'],
          enableCustomerAccount: false,
          enablePayeverTerms: false,
          enableLegalPolicy: false,
          enableDisclaimerPolicy: false,
          enableRefundPolicy: false,
          enableShippingPolicy: false,
          enablePrivacyPolicy: false,
          languages: [{
            active: true,
            code: '123abc',
            isDefault: true,
            name: 'some name',
          }],
          testingMode: true,
          message: 'Some message',
        },
      };
    },
  } as any;

  private integration: IntegrationModel = {
    category: 'Some Category',
    displayOptions: {
      icon: 'some icon',
      title: 'Some title',
    } as any,
    name: 'Some name',
    settingsOptions: {
      source: 'some source',
    },
  } as IntegrationModel;

  @PactRabbitMqMessageProvider(MessageBusEventsEnum.CheckoutCreated)
  public async mockBusinessCheckoutCreated(): Promise<void> {
    const producer: RabbitEventsProducer = await this.getProvider<RabbitEventsProducer>(RabbitEventsProducer);
    await producer.businessCheckoutCreated(this.checkout);
  }

  @PactRabbitMqMessageProvider(MessageBusEventsEnum.CheckoutUpdated)
  public async mockBusinessCheckoutUpdated(): Promise<void> {
    const producer: RabbitEventsProducer = await this.getProvider<RabbitEventsProducer>(RabbitEventsProducer);
    await producer.businessCheckoutUpdated(this.checkout);
  }

  @PactRabbitMqMessageProvider(MessageBusEventsEnum.CheckoutRemoved)
  public async mockBusinessCheckoutRemoved(): Promise<void> {
    const producer: RabbitEventsProducer = await this.getProvider<RabbitEventsProducer>(RabbitEventsProducer);
    await producer.businessCheckoutRemoved(this.business, this.checkout);
  }

  @PactRabbitMqMessageProvider(MessageBusEventsEnum.CheckoutIntegrationEnabled)
  public async mockCheckoutIntegrationEnabled(): Promise<void> {
    const producer: RabbitEventsProducer = await this.getProvider<RabbitEventsProducer>(RabbitEventsProducer);
    await producer.checkoutIntegrationEnabled(this.integration, this.checkout);
  }

  @PactRabbitMqMessageProvider(MessageBusEventsEnum.CheckoutIntegrationDisabled)
  public async mockCheckoutIntegrationDisabled(): Promise<void> {
    const producer: RabbitEventsProducer = await this.getProvider<RabbitEventsProducer>(RabbitEventsProducer);
    await producer.checkoutIntegrationDisabled(this.integration, this.checkout);
  }
}
