import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { environment } from '../../environments';
import { TaskProcessor } from '../decorators/task.processor';
import { RabbitBinding, TaskType } from '../enums';
import { TaskModel } from '../models';
import { AbstractProcessor } from './abstract.processor';
import { ReportDetailDocument } from '../schemas';
import { RunInstructionResult, ValidateInstructionResultDataInterface } from '../interfaces';

interface IntegrationInterface {
  integration: { name: string };
}
interface ConnectIntegrationInterface {
  integrations: IntegrationInterface[];
}

@Injectable()
@TaskProcessor(TaskType.Connect)
export class ConnectProcessor extends AbstractProcessor {
  protected name: string = TaskType.Connect;
  protected required: string[] = [
    TaskType.Apps,
    TaskType.Business,
  ];

  public async runInstruction(task: TaskModel): Promise<RunInstructionResult> {

    await this.rabbitClient.send(
      {
        channel: RabbitBinding.OnboardingSetupConnect,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.OnboardingSetupConnect,
        payload: { 
          businessId: task.businessId, 
          integrations: task.incomingData.connect.install,
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
    const connectApps: AxiosResponse<ConnectIntegrationInterface> = 
    await this.httpService.get<ConnectIntegrationInterface>(
      [
        environment.microservices.connectUrl,
        `/api/business/${task.businessId}/integration/active`,
      ].join(''),
      this.getAxiosRequestConfig(task),
    ).toPromise();

    const expectedApps: string[] = task.incomingData.connect.install;
    const actualApps: string[] = connectApps.data.integrations.map((connectApp: IntegrationInterface) => 
    connectApp.integration.name);

    return {
      actual: expectedApps,
      expected: actualApps,
      valid: expectedApps.every(val => actualApps.includes(val)),
    };
  }

}
