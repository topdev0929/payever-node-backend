import { Injectable, Provider, Type } from '@nestjs/common';
import {
  PactConsumerOptionsFactory,
  PactConsumerOverallOptions,
  PactProviderOptions,
  PactProviderOptionsFactory,
} from 'nestjs-pact';

import { AbstractStateFixture } from '@pe/pact-kit';

import { pactEnvConfig } from './config';

import { InventoryMessagesProvider } from './providers';

@Injectable()
export class PactConfigOptionsService
  implements PactProviderOptionsFactory, PactConsumerOptionsFactory {
  public static messageProviders: Provider[] = [InventoryMessagesProvider];
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
