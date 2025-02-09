import { ITestStepHookParameter } from '@cucumber/cucumber';
import { TestingModuleBuilder } from '@nestjs/testing';
import { ProviderInterface } from '@pe/cucumber-sdk';
import { INestApplication, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RedisClient } from '@pe/nest-kit';
import MockedRedis from 'ioredis-mock';
import type { Cluster } from 'ioredis';

export const WEBSOCKET_PROVIDER_NAME: string = 'WebsocketProvider';
export class WebsocketProvider implements ProviderInterface {
  protected client: Cluster;
  protected application: INestApplication;
  protected logger: Logger;

  public constructor() {
    this.client =
      new MockedRedis.Cluster([]);

  }

  public async configure(builder: TestingModuleBuilder, scenario: ITestStepHookParameter): Promise<void> {
    builder.overrideProvider(RedisClient).useValue({
      ...this.client,
      deleteKeysByPattern: () => { },
      fixTtl: () => { },
      getClient: (): any => {
        return this.client.duplicate();
      },
    });
  }

  public async setup(application: INestApplication, logger: Logger): Promise<void> {
    this.application = application;
    this.logger = logger;
    this.application.useWebSocketAdapter(
      new IoAdapter(
        application,
      ),
    );
  }
  public async close(): Promise<void> { }
  public getName(): string {
    return WEBSOCKET_PROVIDER_NAME;
  }
}
