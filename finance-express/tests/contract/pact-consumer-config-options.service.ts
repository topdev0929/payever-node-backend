import { Injectable } from '@nestjs/common';
import {
  PactConsumerOptionsFactory,
  PactConsumerOverallOptions
} from 'nestjs-pact';

import { pactEnvConfig } from './config';

@Injectable()
export class PactConfigOptionsService implements PactConsumerOptionsFactory {
  public async createPactConsumerOptions(): Promise<PactConsumerOverallOptions> {
    return {
      consumer: pactEnvConfig.consumer,
      publication: pactEnvConfig.publish,
    };
  }
}
