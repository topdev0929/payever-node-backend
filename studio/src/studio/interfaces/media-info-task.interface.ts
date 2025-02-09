import { MediaOwnerTypeEnum, MediaTypeEnum, TaskStatusEnum } from '../enums';

export interface MediaInfoTaskInterface {
  mediaId: string;
  mediaType: MediaTypeEnum;
  ownerType: MediaOwnerTypeEnum;
  status: TaskStatusEnum;
  tries: number;
  url: string;
}
