import { TaskStatusEnum } from '../enums';

export interface VideoGeneratorTaskInterface {
  status: TaskStatusEnum;
  task: {
    type: string;
    data: any;
  };
  tries?: number;
}
