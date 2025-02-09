import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

import { TaskProcessor } from '../decorators/task.processor';
import { RabbitBinding, TaskType } from '../enums';
import { AbstractProcessor } from './abstract.processor';
import { TaskModel } from '../models';
import { environment } from '../../environments';
import { ReportDetailDocument } from '../schemas';
import { isMatch } from 'lodash';
import { RunInstructionResult, ValidateInstructionResultDataInterface } from '../interfaces';
export interface TerminalInterface {
  integrationSubscriptions?: string[];
  default: boolean;
  defaultLocale: string;
  message: string;
  name: string;
  logo: string;
  locales: string[];
  phoneNumber: string;
  live: boolean;
  forceInstall?: boolean;
}

export interface IntegrationSubscriptionInterface {
  integration?: { name: string };
  installed?: boolean;
}

/* TODO: add all integrations */
const wellKnownPosIntegrations: string[] = ['device-payments', 'qr'];

@Injectable()
@TaskProcessor(TaskType.Pos)
export class PosProcessor extends AbstractProcessor {
  protected required: string[] = [
    TaskType.Apps,
    TaskType.Connect,
  ];

  public async runInstruction(task: TaskModel): Promise<RunInstructionResult> {
    await new Promise<void>((resolve: () => void) => setTimeout(resolve, 5000));

    const integrationsToInstall: string[] = task.incomingData.connect?.install?.filter(
      (integration: string) => wellKnownPosIntegrations.includes(integration),
    ) || [];

    await this.rabbitClient.send(
      {
        channel: RabbitBinding.OnboardingSetupCheckout,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.OnboardingSetupCheckout,
        payload: { 
          businessId: task.businessId, 
          integrationsToInstall,
         },
      },
    );

    return { };
  }

  public async revertInstruction(task: TaskModel): Promise<void> { }

  public async validateInstruction(
    task: TaskModel, 
    reportDetail: ReportDetailDocument,
  ): Promise<ValidateInstructionResultDataInterface> {
    const defaultPos: AxiosResponse<TerminalInterface> = 
    await this.httpService.get<TerminalInterface>(
      [
        environment.microservices.posUrl,
        `/api/${task.businessId}`,
      ].join(''),
      this.getAxiosRequestConfig(task),
    ).toPromise();

    const posIntegrations: AxiosResponse<IntegrationSubscriptionInterface[]> = 
    await this.httpService.get<IntegrationSubscriptionInterface[]>(
      [
        environment.microservices.posUrl,
        `/api/business/${task.businessId}/integration`,
      ].join(''),
      this.getAxiosRequestConfig(task),
    ).toPromise();

    const expected: any = {
      installedIntegrations: wellKnownPosIntegrations,
      logo: !!task.incomingData.business.logo,
      name: task.incomingData.business.name,
    };

    const installedIntegrations: string[] = posIntegrations.data
    .filter((integration: IntegrationSubscriptionInterface) => integration.installed)
    .map((integration: IntegrationSubscriptionInterface) => integration.integration.name);

    const actual: any = {
      installedIntegrations: installedIntegrations,
      logo: !!defaultPos.data.logo,
      name: defaultPos.data.name,
    };

    return {
      actual,
      expected,
      valid: isMatch(actual, expected),
    };
  }

}
