import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import * as ffmpeg from 'fluent-ffmpeg';
import * as mkdirp from 'mkdirp';
import * as os from 'os';
import * as randomstring from 'randomstring';
import * as rimraf from 'rimraf';
import { ServiceTagEnum, VideoGeneratorTaskTypeEnum } from '../../../enums';
import { VideoHelper } from '../../../helpers';
import { VideoInfoInterface } from '../../../interfaces';
import { VideoGeneratorTaskModel } from '../../../models';
import { SceneInfoService, VideoGeneratorTaskService, VideoInfoService } from '../../../services';
import { VideoGeneratorTaskStrategyInterface } from './interfaces';

@Injectable()
@ServiceTag(ServiceTagEnum.VIDEO_GENERATOR_TASK)
export class FrameGeneratorStrategy implements VideoGeneratorTaskStrategyInterface {
  public readonly type: VideoGeneratorTaskTypeEnum = VideoGeneratorTaskTypeEnum.generateFrames;

  constructor(
    private readonly videoInfoService: VideoInfoService,
    private readonly taskService: VideoGeneratorTaskService,
    private readonly sceneInfoService: SceneInfoService,
    private readonly logger: Logger,
  ) { }

  public async runTask(
    taskModel: VideoGeneratorTaskModel,
  ): Promise<void> {
    this.logger.log(`Processing video: start`);
    const videoPath: string = taskModel.task.data.videoPath;
    const randomTempFolder: string = `${os.tmpdir()}/screenshoot/${randomstring.generate(7)}`;
    await mkdirp(randomTempFolder);
    
    return new Promise((resolve: (val: any) => void, reject: () => void) => {
      ffmpeg(videoPath)
      .output(`${randomTempFolder}/%03d.png`)
      .on('end', () => {
        this.logger.log(`Processing video: frames generated`);
        resolve('ok');
      })
      .on('error', reject)
      .run();
    }).then( async () => {
      let videoInfoData: VideoInfoInterface = await this.videoInfoService.generateVideoInfo(randomTempFolder);

      videoInfoData.video = videoPath;
      let videoInfo: VideoInfoInterface;
      try {
        videoInfo = await VideoHelper.getVideoInfo(videoPath);
      } catch (err) {
        this.logger.log(`Error: ${err}`);
        throw err;
      }

      videoInfoData = {
        ...videoInfoData,
        ...videoInfo,
      };

      await this.videoInfoService.updateOrInsert(videoPath, videoInfoData);
      await this.sceneInfoService.generateSceneInfo(randomTempFolder, videoInfoData, videoPath);
      rimraf(`${randomTempFolder}`, () => { });

      this.logger.log(`Processing video: finished !!!`);
    }).catch((err: Error) => {
      this.logger.log(`Error: ${err}`);
      throw err;
    });
  }
}
