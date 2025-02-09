import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { environment } from '../../environments';
import { TaskProcessor } from '../decorators/task.processor';
import { RabbitBinding, TaskType } from '../enums';
import { TaskModel } from '../models';
import { AbstractProcessor } from './abstract.processor';
import { RunInstructionResult, ValidateInstructionResultDataInterface } from '../interfaces';

interface CommerceOSOnboardingInterface {
  afterRegistration: Array<{ payload: { apps: Array<{ code: string }> }; name: string }>;
}

export interface MinRegisteredApp {
  _id: string;
  setupStatus: string;
  code: string;
  appName: string;
  tag: string;
  bootstrapScriptUrl: string;
  dashboardInfo: any;
  installed: boolean;
  default: boolean;
}

@Injectable()
@TaskProcessor(TaskType.Apps)
export class AppsProcessor extends AbstractProcessor {
  protected required: string[] = [
    TaskType.Business,
  ];

  public async runInstruction(task: TaskModel): Promise<RunInstructionResult> {

    task.incomingData.pos = true;
    task.markModified('incomingData');

    await task.save();

    await this.rabbitClient.send(
      {
        channel: RabbitBinding.OnboardingSetupApps,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.OnboardingSetupApps,
        payload: { 
          businessId: task.businessId, 
          onboardingName: task.incomingData.apps.onboardingName || 'business',
          userId: task.user.id, 
         },
      },
    );

    return { };
  }

  public async revertInstruction(task: TaskModel): Promise<void> { }

  public async validateInstruction(
    task: TaskModel, 
  ): Promise<ValidateInstructionResultDataInterface> { 
    const commerceosAppsResult: AxiosResponse<MinRegisteredApp[]> = await this.httpService.get<MinRegisteredApp[]>(
      [
        environment.microservices.commerceosUrl,
        `/api/apps/business/${task.businessId}`,
      ].join(''),
      this.getAxiosRequestConfig(task),
    ).toPromise();

    const actualInstalledApps: string[] = commerceosAppsResult.data.
    filter((commerceosApp: MinRegisteredApp) => commerceosApp.installed)
    .map((commerceosApp: MinRegisteredApp) => commerceosApp.code);

    const expectedInstalledApps: string[] = task.incomingData.apps.install;

    return {
      actual: actualInstalledApps,
      expected: expectedInstalledApps,
      valid: expectedInstalledApps.every((val: string) => actualInstalledApps.includes(val)),
    };
  }
}
