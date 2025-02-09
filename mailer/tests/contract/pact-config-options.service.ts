import { Injectable, Type, Provider } from '@nestjs/common';
import { AbstractStateFixture } from '@pe/pact-kit';
import {
  PactProviderOptionsFactory,
  PactProviderOptions,
  PactConsumerOptionsFactory,
  PactConsumerOverallOptions,
} from 'nestjs-pact';

import { pactEnvConfig } from './config';

@Injectable()
export class PactConfigOptionsService implements PactProviderOptionsFactory, PactConsumerOptionsFactory {
  public static messageProviders: Provider[] = [];
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
