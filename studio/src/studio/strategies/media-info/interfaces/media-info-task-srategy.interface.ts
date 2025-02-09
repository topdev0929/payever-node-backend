import { MediaOwnerTypeEnum, MediaTypeEnum } from '../../../enums';
import { MediaInfoTaskModel } from '../../../models';

export interface MediaInfoTaskStrategyInterface {
  ownerType: MediaOwnerTypeEnum;
  mediaType: MediaTypeEnum;
  runTask: (
    mediaInfoTasks: MediaInfoTaskModel[],
  ) => Promise<void>;
}
