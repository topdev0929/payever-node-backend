import { Injectable, Provider, Type } from '@nestjs/common';
import {
  PactConsumerOptionsFactory,
  PactConsumerOverallOptions,
  PactProviderOptions,
  PactProviderOptionsFactory,
} from 'nestjs-pact';

import { AbstractStateFixture, PePact } from '@pe/pact-kit';

import { pactEnvConfig } from './config';
import {
  ApplicationEventMock,
  ChannelEventMessagesProducerMock,
  MediaEventsMessagesMock,
  ReportDataMessagesMock,
  TerminalRabbitEventMessagesMock,
} from './producer';
import { OnboardedBusinessStateFixture } from './states';

type CreateTestingModuleOptions = Parameters<typeof PePact['publish']>[2];

@Injectable()
export class PactConfigOptionsService implements PactProviderOptionsFactory, PactConsumerOptionsFactory {
  public static messageProviders: Provider[] = [
    ReportDataMessagesMock,
    ApplicationEventMock,
    TerminalRabbitEventMessagesMock,
    MediaEventsMessagesMock,
    ChannelEventMessagesProducerMock,
  ];
  public static stateFixtures: Array<Type<AbstractStateFixture>> = [
    OnboardedBusinessStateFixture,
  ];
  public async createPactProviderOptions(): Promise<PactProviderOptions> {
    return pactEnvConfig.provider;
  }

  public async createPactConsumerOptions(): Promise<PactConsumerOverallOptions> {
    return {
      consumer: pactEnvConfig.consumer,
      publication: pactEnvConfig.publish,
    };
  }
}
