import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import * as mkdirp from 'mkdirp';
import * as os from 'os';
import * as randomstring from 'randomstring';
import { VideoGeneratorTaskStrategyInterface } from './interfaces';
import { ServiceTagEnum, VideoGeneratorTaskTypeEnum } from '../../../enums';
import { FrameHelper, IndicatorHelper, MathHelper } from '../../../helpers';
import { ColorInterface } from '../../../interfaces';
import { GeneratedVideoModel, SceneInfoModel, VideoGeneratorTaskModel } from '../../../models';
import { VideoGeneratorMessagesProducer } from '../../../producers';
import { SceneInfoService, VideoGeneratorService, VideoGeneratorTaskService } from '../../../services';

@Injectable()
@ServiceTag(ServiceTagEnum.VIDEO_GENERATOR_TASK)
export class VideoGeneratorByTagStrategy implements VideoGeneratorTaskStrategyInterface {
  public readonly type: VideoGeneratorTaskTypeEnum = VideoGeneratorTaskTypeEnum.generateVideoByTag;

  constructor(
    private readonly videoGeneratorProducer: VideoGeneratorMessagesProducer,
    private readonly taskService: VideoGeneratorTaskService,
    private readonly videoGeneratorService: VideoGeneratorService,
    private readonly sceneInfoService: SceneInfoService,
    private readonly logger: Logger,
  ) { }

  public async runTask(
    taskModel: VideoGeneratorTaskModel,
  ): Promise<void> {
    this.logger.log(`Generate video by tag: start`);
    const tempFolder: string = `${os.tmpdir()}/scene/${randomstring.generate(7)}`;
    await mkdirp(tempFolder);
    const scenePool: SceneInfoModel[] = await this.sceneInfoService.getScenePool(taskModel.task.data.body.tags);
    const generatedVideo: GeneratedVideoModel = await this.videoGeneratorService.generateVideoInit(
      taskModel.task.data.body.audio,
    );
    await this.generateRandomScenes(tempFolder, scenePool, taskModel.task.data.body.duration);
    await this.videoGeneratorService.mergeScenes(
      `video by tag`,
      taskModel.task.data,
      tempFolder,
      taskModel.task.data.body.audio,
      generatedVideo.id,
    );
  }

  private async generateRandomScenes(
    tempFolder: string,
    originScenePool: SceneInfoModel[],
    durationLeft: number,
    scenePool: SceneInfoModel[] = [],
    count: number = 1,
    lastRGB?: ColorInterface,
  ): Promise<void> {
    IndicatorHelper.processingIndicator(count);

    if (scenePool.length === 0) {
      scenePool = originScenePool;
    }

    const scene: SceneInfoModel = FrameHelper.getFrameOrScene(scenePool, count, lastRGB) as SceneInfoModel;

    const startCutTime: number = parseFloat((scene.time.start + 0.1).toFixed(2));
    const cutDuration: number = parseFloat(((scene.time.end - scene.time.start) - 0.1).toFixed(2));
    const countStrPad: string = MathHelper.pad(count, 3);

    await this.videoGeneratorService.generateVideo(
      scene,
      startCutTime,
      cutDuration,
      tempFolder,
      countStrPad,
    );

    scenePool = FrameHelper.removeSceneFromPool(scene, scenePool);
    durationLeft -= cutDuration;
    lastRGB = scene.color.end;
    count++;
    if (durationLeft > 0) {
      await this.generateRandomScenes(
        tempFolder,
        originScenePool,
        durationLeft,
        scenePool,
        count,
        lastRGB,
      );
    }
  }
}
