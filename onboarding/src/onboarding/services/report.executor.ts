import { Injectable, Logger, HttpService } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { DiscoveredClassWithMeta, DiscoveryService } from '@pe/nest-kit/modules/discovery';
import { TASK_PROCESSOR_METADATA } from '../constants';
import { TaskModel } from '../models';
import { AbstractProcessor } from '../processors';
import { environment } from '../../environments';
import { ReportDetailDocument } from '../schemas';
import { ValidateInstructionResultDataInterface } from '../interfaces';
import { ProcessingStatus, TaskType } from '../enums';
import { TokenResultDto } from '../dto';

@Injectable()
export class ReportExecutor {
  private processors: Map<string, AbstractProcessor> = new Map();

  constructor(
    private discovery: DiscoveryService,
    private logger: Logger,
    private readonly httpService: HttpService,
  ) { }

  public async execute(task: TaskModel, reportDetail: ReportDetailDocument): Promise<void> {
    reportDetail.status = ProcessingStatus.InProcess;
    await reportDetail.save();
    await this.enableBusiness(task);

    let status: ProcessingStatus =  ProcessingStatus.Finished;
    let valid: boolean = true;

    const doneProcessors: AbstractProcessor[] = [];
    const error: any = [];

    const incommingTaskKey: string[] = Object.keys(task.incomingData);
    for (const taskKey of Object.values(TaskType) as string[]) {
      if (!incommingTaskKey.includes(taskKey)) {
        continue;
      }
      const processor: AbstractProcessor = await this.getProcessor(taskKey);
      try { 
        valid = (await this.runProcessor(processor, task, reportDetail, doneProcessors)) && valid;
      } catch (e) {
        error.push(this.handleException(e, taskKey));
        status = ProcessingStatus.Error;
      }
    }

    reportDetail.error = error;

    if (status === ProcessingStatus.Finished) {
      reportDetail.valid = valid;
    }
    
    reportDetail.status = status;
    await reportDetail.save();
  }

  protected async enableBusiness(task: TaskModel): Promise<TokenResultDto> {
    const businessSpecificToken: AxiosResponse<TokenResultDto> = await this.httpService.patch<TokenResultDto>(
      `${environment.microservices.authUrl}/api/business/${task.businessId}/enable`,
      { },
      this.getAxiosRequestConfig(task),
    ).toPromise();  

    task.token = businessSpecificToken.data.accessToken;
    task.markModified('token');
    await task.save();

    return businessSpecificToken.data;
  }

  protected getAxiosRequestConfig(task: TaskModel): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${task.token}`,
        'User-Agent': task.userAgent,
      },
    };
  }

  private async runProcessor(
    processor: AbstractProcessor,
    task: TaskModel,
    reportDetail: ReportDetailDocument,
    doneProcessors: AbstractProcessor[],
  ): Promise<boolean> {
    let result: boolean = false;
    if (doneProcessors.includes(processor)) {
      return;
    }
    try {
      result = await this.validateInstructionAndSaveResult(processor, task, reportDetail);
      doneProcessors.push(processor);
    } catch (e) {
      this.logger.error(e, 'PROCESSOR:ERROR');
      throw e;
    } finally {
      //  @warn wait until processing results will be consumed by all other apps
      await new Promise<void>((resolve: () => void) => setTimeout(resolve, environment.processorDelayMs));
    }

    return result;
  }

  private async validateInstructionAndSaveResult(
    processor: AbstractProcessor,
    task: TaskModel,
    reportDetail: ReportDetailDocument,
  ): Promise<boolean> {
    const result: ValidateInstructionResultDataInterface = await processor.validateInstruction(task, reportDetail);
    const processorKey: string = (processor as any).constructor.name;

    reportDetail.resultData[processorKey] = result;
    reportDetail.markModified('resultData');
    await reportDetail.save();

    return result.valid;
  }

  private async getProcessor(type: string): Promise<AbstractProcessor> {
    let processor: AbstractProcessor = this.processors.get(type);

    if (undefined === processor) {
      const providers: Array<DiscoveredClassWithMeta<string>> = await this.discovery.providersWithMetaAtKey<string>(
        TASK_PROCESSOR_METADATA,
      );
      const provider: DiscoveredClassWithMeta<string> =
        providers.filter((instance: DiscoveredClassWithMeta<string>) => instance.meta === type).shift();

      if (undefined === provider) {
        this.logger.error(`There is no processor of type "${type}", but it is required.`);
        throw Error(`There is no processor of type "${type}", but it is required.`);
      }

      processor = provider.discoveredClass.instance as AbstractProcessor;
      this.processors.set(type, processor);
    }

    return processor;
  }

  private handleException(e: any, processer: string): object {
    let error: { [key: string]: any } = { };

    try {
      if (e instanceof Error) {
        error = {
          message: e.message,
          name: e.name,
          processer: processer,
          stack: e.stack,
        };
      } else {
        error = JSON.parse(JSON.stringify(e));
      }
      this.logger.error(e);
    } catch (err) {
      error = {
        ...error,
        __catching_error: `stringify error`,
      };
    }
    if (e.response) {
      error.response = e.response.data;
    }

    return error;
  }

}
