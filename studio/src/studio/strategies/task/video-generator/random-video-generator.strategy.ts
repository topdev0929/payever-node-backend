import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import * as mkdirp from 'mkdirp';
import * as os from 'os';
import * as randomstring from 'randomstring';
import { GenerateRandomVideoDto } from '../../../dto';
import { ServiceTagEnum, VideoGeneratorTaskTypeEnum } from '../../../enums';
import { ColorHelper, FrameHelper, MathHelper } from '../../../helpers';
import {
  ColorInterface,
  FramePoolInterface,
  OriginFramePoolInterface,
  VideoCutDataInterface,
  VideoGeneratorInterface,
} from '../../../interfaces';
import { GeneratedVideoModel, VideoGeneratorTaskModel, VideoInfoModel } from '../../../models';
import { VideoGeneratorService, VideoGeneratorTaskService, VideoInfoService } from '../../../services';
import { VideoGeneratorTaskStrategyInterface } from './interfaces';

@Injectable()
@ServiceTag(ServiceTagEnum.VIDEO_GENERATOR_TASK)
export class RandomVideoGeneratorStrategy implements VideoGeneratorTaskStrategyInterface {
  public readonly type: VideoGeneratorTaskTypeEnum = VideoGeneratorTaskTypeEnum.generateRandomVideo;

  constructor(
    private readonly taskService: VideoGeneratorTaskService,
    private readonly videoGeneratorService: VideoGeneratorService,
    private readonly videoInfoService: VideoInfoService,
    private readonly logger: Logger,
  ) { }

  public async runTask(
    taskModel: VideoGeneratorTaskModel,
  ): Promise<void> {
    this.logger.log(`Generate random video: starting`);
    const businessId: string = taskModel.task.data.businessId;
    const body: GenerateRandomVideoDto = taskModel.task.data.body;
    const tempFolder: string = `${os.tmpdir()}/scene/${randomstring.generate(7)}`;
    await mkdirp(tempFolder);
    const framesPoolInfo: VideoGeneratorInterface = await this.videoInfoService.generateFramePoolInfo(body);
    const generatedVideo: GeneratedVideoModel = await this.videoGeneratorService.generateVideoInit(body.audio);
    await this.generateRandomScenes(tempFolder, generatedVideo.id, framesPoolInfo);
    await this.videoGeneratorService.mergeScenes(`random video`, businessId, tempFolder, body.audio, generatedVideo.id);
  }

  private async generateRandomScenes(
    tempFolder: string,
    videoId: string,
    framesPoolInfo: VideoGeneratorInterface,
    count: number = 1,
    framesPool?: FramePoolInterface[],
    lastRGB?: ColorInterface,
  ): Promise<void> {
    const videoCutData: VideoCutDataInterface = framesPoolInfo.videoCutData;
    const originFramesPool: OriginFramePoolInterface = framesPoolInfo.originFramesPool;
    framesPool = FrameHelper.generateFramesPool(videoCutData, originFramesPool, framesPool);
    const startFrame: FramePoolInterface =
      FrameHelper.getFrameOrScene(framesPool, count, lastRGB) as FramePoolInterface;
    const currentVideoCutData: any = videoCutData[startFrame.video];
    const startCutTime: number = parseFloat(((startFrame.frame / currentVideoCutData.fps) + 0.1).toFixed(2));
    const cutDuration: number = await FrameHelper.getNewCutDuration(
      startCutTime,
      currentVideoCutData.cutDuration,
      currentVideoCutData,
      framesPool,
      startFrame,
      tempFolder,
      videoCutData,
    );
    const countStrPad: string = MathHelper.pad(count, 3);
    const videoInfo: VideoInfoModel = await this.videoInfoService.findOneByVideo(startFrame.video);

    await this.videoGeneratorService.generateVideo(videoInfo, startCutTime, cutDuration, tempFolder, countStrPad);
    await this.videoGeneratorService.saveScene(
      originFramesPool,
      startFrame,
      cutDuration,
      currentVideoCutData.fps,
      videoId,
    );

    currentVideoCutData.noClips--;
    framesPool =
      FrameHelper.removeUnavailableFrame(framesPool, startCutTime, cutDuration, startFrame.video, currentVideoCutData);
    const rgb: ColorInterface =
      await ColorHelper.getLastRGBColor(`${tempFolder}/sample-cut-${countStrPad}.mp4`, (cutDuration - 0.1), `sample-cut-${countStrPad}.png`, tempFolder);

    count++;
    if (FrameHelper.hasClipLeft(videoCutData)) {
      await this.generateRandomScenes(tempFolder, videoId, framesPoolInfo, count, framesPool, rgb);
    }
  }
}
