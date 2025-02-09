import { VideoGeneratorTaskTypeEnum } from '../../../../enums';
import { VideoGeneratorTaskModel } from '../../../../models';

export interface VideoGeneratorTaskStrategyInterface {
  type: VideoGeneratorTaskTypeEnum;
  runTask: (
    body: VideoGeneratorTaskModel,
  ) => Promise<void>;
}
