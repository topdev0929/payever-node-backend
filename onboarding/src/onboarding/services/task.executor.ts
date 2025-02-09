import { Injectable, Logger } from '@nestjs/common';
import { DiscoveredClassWithMeta, DiscoveryService } from '@pe/nest-kit/modules/discovery';
import { TASK_PROCESSOR_METADATA } from '../constants';
import { ProcessingStatus, TaskType } from '../enums';
import { ObjectMerger } from '../helpers/object.merger';
import { TaskModel } from '../models';
import { AbstractProcessor } from '../processors';
import { environment } from '../../environments';
import { RunInstructionResult } from '../interfaces';

@Injectable()
export class TaskExecutor {
  private processors: Map<string, AbstractProcessor> = new Map();

  constructor(
    private discovery: DiscoveryService,
    private logger: Logger,
  ) { }

  public async execute(task: TaskModel): Promise<void> {
    task.status = ProcessingStatus.InProcess;
    await task.save();

    let status: ProcessingStatus =  ProcessingStatus.Finished;

    const doneProcessors: AbstractProcessor[] = [];
    const error: any = [];

    const incommingTaskKey: string[] = Object.keys(task.incomingData);
    for (const taskKey of Object.values(TaskType) as string[]) {
      if (!incommingTaskKey.includes(taskKey) && taskKey !== TaskType.PreloadMedia) {
        continue;
      }
      const processor: AbstractProcessor = await this.getProcessor(taskKey);
      try { 
        await this.runProcessor(processor, task, doneProcessors);
      } catch (e) {
        error.push(this.handleException(e, taskKey));
        status = ProcessingStatus.Error;
      }
    }

    task.error = error;

    task.status = status;
    await task.save();
  }

  public async executeProcesses(tasks: TaskModel[]): Promise<void> {

    const doneProcessors: AbstractProcessor[] = [];

    let status: ProcessingStatus =  ProcessingStatus.Finished;

    const error: any = [];

    for (const taskKey of Object.values(TaskType) as string[]) {
      for (const task of tasks) {
        task.status = ProcessingStatus.InProcess;
        await task.save();
        const incommingTaskKey: string[] = Object.keys(task.incomingData);

        if (!incommingTaskKey.includes(taskKey) && taskKey !== TaskType.PreloadMedia) {
          continue;
        }
        const processor: AbstractProcessor = await this.getProcessor(taskKey);
        try { 
          await this.runProcessor(processor, task, doneProcessors, false);
        } catch (e) {
          error.push(this.handleException(e, taskKey));
          status = ProcessingStatus.Error;
        }
        task.doneProcess.push(taskKey);
        task.error = error;

        task.status = status;
        if (task.doneProcess.length >= Object.values(TaskType).length) {
          task.status = ProcessingStatus.Finished;
        }
    
        await task.save();
      }

    }

  }

  private async runProcessor(
    processor: AbstractProcessor,
    task: TaskModel,
    doneProcessors: AbstractProcessor[],
    runRequired: boolean = true,
  ): Promise<void> {
    if (doneProcessors.includes(processor)) {
      return;
    }

    if (runRequired) {
      for (const requiredType of processor.getRequired()) {
        const requiredProcessor: AbstractProcessor = await this.getProcessor(requiredType);
        await this.runProcessor(requiredProcessor, task, doneProcessors);
      }
    }

    try {
      await this.runInstructionAndSaveResult(processor, task);
      doneProcessors.push(processor);
    } catch (e) {
      try {
        await processor.revertInstruction(task);
      } catch (err) {
        this.logger.error(err, 'PROCESSOR:REVERT');
      }
      throw e;
    } finally {
      //  @warn wait until processing results will be consumed by all other apps
      await new Promise<void>((resolve: () => void) => setTimeout(resolve, environment.processorDelayMs));
    }
  }

  private async runInstructionAndSaveResult(
    processor: AbstractProcessor,
    task: TaskModel,
  ): Promise<void> {
    const result: RunInstructionResult = await processor.runInstruction(task);
    const processorKey: string = (processor as any).constructor.name;
    task.resultData[processorKey] = ObjectMerger.merge(
      task.resultData[processorKey] || { },
      {
        result,
        status: ProcessingStatus.Finished,
      },
    );
    task.markModified('resultData');
    await task.save();
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
