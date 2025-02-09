import { Injectable, Type, DynamicModule, Provider } from '@nestjs/common';
import {
  PactProviderOptionsFactory,
  PactProviderOptions,
  PactConsumerOptionsFactory,
  PactConsumerOverallOptions,
} from 'nestjs-pact';

import { AbstractStateFixture } from '@pe/pact-kit';

import { pactEnvConfig } from './config';
import {
  SubscriptionPlanMessagesMock,
  SubscriptionNetworkMessagesMock,
} from './providers';

@Injectable()
export class PactConfigOptionsService implements PactProviderOptionsFactory, PactConsumerOptionsFactory {
  public static messageProviders: Provider[] = [
    SubscriptionPlanMessagesMock,
    SubscriptionNetworkMessagesMock,
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
