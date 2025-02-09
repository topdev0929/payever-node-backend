import { TaskFormatterResultInterface } from '../interfaces';
import { TaskModel } from '../models';

export class TaskFormatter {
  public static format(task: TaskModel): TaskFormatterResultInterface {
    return {
      id: task.id,
      result: task.resultData,
      status: task.status,
    };
  }
}
