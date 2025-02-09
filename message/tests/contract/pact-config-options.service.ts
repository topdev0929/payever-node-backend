import { Injectable, Type, Provider } from '@nestjs/common';
import {
  PactProviderOptionsFactory,
  PactProviderOptions,
  PactConsumerOptionsFactory,
  PactConsumerOverallOptions,
} from 'nestjs-pact';

import { pactEnvConfig } from './config';

import { AbstractStateFixture } from '@pe/pact-kit';
import { ChannelMessagesMock } from './provider';

@Injectable()
export class PactConfigOptionsService implements PactProviderOptionsFactory, PactConsumerOptionsFactory {
  public static messageProviders: Provider[] = [
    ChannelMessagesMock
  ];
  public static stateFixtures: Array<Type<AbstractStateFixture>> = [
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
