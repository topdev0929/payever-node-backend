import { Injectable, Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as schedule from 'node-schedule';
import { environment } from '../../environments';
import { SchedulerService } from '../services/scheduler.service';
import { StuckTasksRemoverCron } from './stuck-tasks-remover.cron';

@Injectable()
export class CronManager extends Server implements CustomTransportStrategy {
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly stuckTasksRemover: StuckTasksRemoverCron,
    
    protected readonly logger: Logger,
  ) {
    super();
  }

  public async listen(callback: () => void): Promise<void> {

    schedule.scheduleJob(
      environment.synchronizationCron,
      this.schedulerService.triggerShippingsDataSync.bind(this.schedulerService),
    );
    this.logger.log(`Scheduled shipping data sync job with: ${environment.synchronizationCron}`);

    schedule.scheduleJob(
      environment.removeStuckTasksCron,
      this.stuckTasksRemover.removeStuckTasks.bind(this.stuckTasksRemover),
    );

    callback();
  }

  public async close(): Promise<void> {
    return null;
  }
}
