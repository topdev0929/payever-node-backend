import { INestApplication, Logger } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { CucumberOptionsInterface, ProviderInterface } from '@pe/cucumber-sdk';
import { CustomWsAdapter } from '../../src/statistics/ws';
import * as WebSocket from 'ws';
import { AccessTokenResultModel, TokensGenerationService } from '@pe/nest-kit';
import { AuthStorage } from '@pe/cucumber-sdk/module/auth';

export const WEBSOCKET_PROVIDER_NAME: string = 'WebsocketProvider';

export class WebsocketProvider implements ProviderInterface {
  protected application: INestApplication;
  protected logger: Logger;
  protected client: any;
  protected response: {
    name: string;
    result: any;
  };
  public constructor(protected options: CucumberOptionsInterface) {}

  public async configure(
    builder: TestingModuleBuilder,
    scenario: any
  ): Promise<void> {
    return null;
  }

  public async send(jsonString: string): Promise<void> {
    jsonString = await this.authenticateRequest(jsonString);

    const ws: any = new WebSocket('ws://127.0.0.1:8081/ws');
    await new Promise((resolve: (value?: unknown) => void) =>
      ws.on('open', () => resolve())
    );

    ws.send(jsonString);

    await new Promise<void>(resolve =>
      ws.on('message', (response: string) => {
        this.response = JSON.parse(response);
        resolve();
      })
    );
  }

  public async setup(
    application: INestApplication,
    logger: Logger
  ): Promise<void> {
    this.application = application;
    this.logger = logger;
    this.application.useWebSocketAdapter(
      new CustomWsAdapter(8081, application, logger) as any
    );
  }

  public getResponse(): any {
    return this.response;
  }

  public async close(): Promise<void> {
    this.client = null;
  }

  public getName(): string {
    return WEBSOCKET_PROVIDER_NAME;
  }

  private async authenticateRequest(jsonString: string): Promise<string> {
    if (!AuthStorage.user) {
      return jsonString;
    }

    const tokensGenerator: TokensGenerationService = this.application.get('TokensGenerationService');

    if (!tokensGenerator) {
      return jsonString;
    }

    const token: AccessTokenResultModel = await tokensGenerator.issueToken({
      accessToken: { userModel: AuthStorage.user, expiresIn: '5000', forceUseRedis: false },
    });

    const jsonParsed: any = JSON.parse(jsonString);

    if (jsonParsed.data) {
      jsonParsed.data.token = token.accessToken;
    }

    jsonString = JSON.stringify(jsonParsed);

    return jsonString;
  }
}
