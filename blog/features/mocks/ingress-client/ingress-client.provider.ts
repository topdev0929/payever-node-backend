import { INestApplication, Logger } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { ProviderInterface } from '@pe/cucumber-sdk';
import { IngressClientMock } from './ingress-client.mock';
import { IngressClient } from '@pe/kubernetes-kit/module/kubernetes/services';

export const INGRESS_CLIENT_PROVIDER: string = 'IngressClientProvider';

export class IngressClientProvider implements ProviderInterface {
  protected application: INestApplication;
  protected logger: Logger;
  protected ingressClientMock: IngressClientMock;

  public async configure(builder: TestingModuleBuilder, scenario: any): Promise<void> {
    this.ingressClientMock = new IngressClientMock();
    builder.overrideProvider(IngressClient).useValue(this.ingressClientMock);
  }

  public async setup(application: INestApplication, logger: Logger): Promise<void> {
    this.application = application;
    this.logger = logger;
  }

  public async close(): Promise<void> {
    this.ingressClientMock = null;
  }

  public getName(): string {
    return INGRESS_CLIENT_PROVIDER;
  }

  public mockMethod(method: string, parameters: any = null, result: any = null): void {
    this.ingressClientMock.mockMethod(method, parameters, result);
  }
}
