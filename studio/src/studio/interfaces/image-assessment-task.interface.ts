import { MediaOwnerTypeEnum, TaskStatusEnum } from '../enums';

export interface ImageAssessmentTaskInterface {
  mediaId: string;
  status: TaskStatusEnum;
  tries: number;
  type: MediaOwnerTypeEnum;
  url: string;
}
