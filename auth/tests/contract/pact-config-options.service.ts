import { Injectable, Type, Provider } from '@nestjs/common';
import {
  PactProviderOptionsFactory,
  PactProviderOptions,
  PactConsumerOptionsFactory,
  PactConsumerOverallOptions,
} from 'nestjs-pact';

import { pactEnvConfig } from './config';
import {
  InvitationMessagesMock,
  OAuthRabbitEventsMessagesMock,
  MailerEventMessagesMock,
  BusinessPermissionMessagesMock,
  TokenIssueMessagesMock,
  UserMessagesMock,
} from './provider';
import { AbstractStateFixture } from '@pe/pact-kit';
import { OnboarderUserStateFixture } from './states';

@Injectable()
export class PactConfigOptionsService implements PactProviderOptionsFactory, PactConsumerOptionsFactory {
  public static messageProviders: Provider[] = [
    InvitationMessagesMock,
    OAuthRabbitEventsMessagesMock,
    MailerEventMessagesMock,
    BusinessPermissionMessagesMock,
    TokenIssueMessagesMock,
    UserMessagesMock,
  ];
  public static stateFixtures: Array<Type<AbstractStateFixture>> = [
    OnboarderUserStateFixture,
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
