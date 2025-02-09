import { HttpService, Injectable, Inject, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { TaskModel } from '../models';
import { ReportDetailDocument } from '../schemas';
import { RunInstructionResult, ValidateInstructionResultDataInterface } from '../interfaces';
import { RabbitMqClient } from '@pe/nest-kit';
import { OnboardingEventsProducer } from '../producers';

@Injectable()
export abstract class AbstractProcessor {
  @Inject() protected readonly httpService: HttpService;
  @Inject() protected readonly logger: Logger;
  @Inject() protected readonly rabbitClient: RabbitMqClient;
  @Inject() protected readonly onboardingEventsProducer: OnboardingEventsProducer;

  protected abstract required: string[];

  public getRequired(): string[] {
    return this.required || [];
  }

  public abstract runInstruction(task: TaskModel): Promise<RunInstructionResult>;
  
  public abstract revertInstruction(task: TaskModel): Promise<void>;
  public abstract validateInstruction(
    task: TaskModel, 
    reportDetail: ReportDetailDocument,
  ): Promise<ValidateInstructionResultDataInterface>;

  protected getAxiosRequestConfig(task: TaskModel): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${task.token}`,
        'User-Agent': task.userAgent,
      },
    };
  }
}
