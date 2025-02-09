import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { ShippingTaskModel } from '../models/shipping-task.model';
import { ShippingTaskService } from '../services/shipping-task.service';

const TASK_IDLE_HOURS: number = 1;

@Injectable()
export class StuckTasksRemoverCron {
  constructor(
    private readonly shippingTaskService: ShippingTaskService,
    private readonly logger: Logger,
  ) { }

  public async removeStuckTasks(): Promise<void> {
    const stuckTime: Date = moment().subtract(TASK_IDLE_HOURS, 'hours').toDate();
    const unfinishedTasks: ShippingTaskModel[] = await this.shippingTaskService.getOldUnfinished(
      stuckTime,
    );
    let updatePromises: Array<Promise<void>> = [];
    
    for (const task of unfinishedTasks) {
      updatePromises.push(
        this.shippingTaskService.taskFail(
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
