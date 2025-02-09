import { Injectable, Type, Provider } from '@nestjs/common';
import {
  PactProviderOptionsFactory,
  PactProviderOptions,
  PactConsumerOptionsFactory,
  PactConsumerOverallOptions,
} from 'nestjs-pact';

import { pactEnvConfig } from './config';
import {
  MediaEventsMessagesMock,
} from './providers';
import { AbstractStateFixture } from '@pe/pact-kit';

@Injectable()
export class PactConfigOptionsService implements PactProviderOptionsFactory, PactConsumerOptionsFactory {
  public static messageProviders: Provider[] = [
    MediaEventsMessagesMock,
  ];
  public static stateFixtures: Array<Type<AbstractStateFixture>> = [];
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
