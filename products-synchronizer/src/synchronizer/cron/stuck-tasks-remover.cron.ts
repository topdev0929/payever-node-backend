import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { SynchronizationTaskItemService, SynchronizationTaskService } from '../services';
import { SynchronizationTaskModel } from '@pe/synchronizer-kit';

const TASK_IDLE_HOURS: number = 1;

@Injectable()
export class StuckTasksRemoverCron {
  constructor(
    private readonly synchronizationTaskService: SynchronizationTaskService,
    private readonly synchronizationTaskItemService: SynchronizationTaskItemService,
    private readonly logger: Logger,
  ) { }

  public async removeStuckTasks(): Promise<void> {
    const stuckTime: Date = moment().subtract(TASK_IDLE_HOURS, 'hours').toDate();
    const unfinishedTasks: SynchronizationTaskModel[] = await this.synchronizationTaskService.getOldUnfinished(
      stuckTime,
    );
    const taskIdsWithRecentUpdatedItems: string[]
      = await this.synchronizationTaskItemService.getTasksIdsWithRecentUpdatedItems(stuckTime, unfinishedTasks);
    const stuckTasks: SynchronizationTaskModel[]  = unfinishedTasks.filter(
      (task: SynchronizationTaskModel) => taskIdsWithRecentUpdatedItems.indexOf(task.id) === -1,
    );

    let updatePromises: Array<Promise<void>> = [];
    this.logger.log(`Found ${stuckTasks.length} stuck tasks from ${unfinishedTasks.length} unfinished tasks`);
    for (const task of stuckTasks) {
      updatePromises.push(
        this.synchronizationTaskService.taskFail(
          task,
          { errorMessage: 'Stuck' },
        ),
      );

      if (updatePromises.length === 10) {
        await Promise.all(updatePromises);
        updatePromises = [];
      }
    }

    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }
  }
}
