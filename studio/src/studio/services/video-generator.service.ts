import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as os from 'os';
import * as randomstring from 'randomstring';
import * as rimraf from 'rimraf';
import * as moment from 'moment';
import { MediaUploadResultDto } from '../dto';
import { MediaTypeEnum } from '../enums';
import { VideoHelper } from '../helpers';
import { FramePoolInterface, OriginFramePoolInterface, VideoInfoInterface } from '../interfaces';
import { GeneratedVideoModel, SceneInfoModel, VideoInfoModel } from '../models';
import { VideoGeneratorMessagesProducer } from '../producers';
import { GeneratedVideoSchemaName } from '../schemas';
import { MediaUploadService } from './media-upload.service';
import { SceneInfoService } from './scene-info.service';
import { UserMediaService } from './user-media.service';

@Injectable()
export class VideoGeneratorService {
  constructor(
    @InjectModel(GeneratedVideoSchemaName) private readonly generatedVideoModel: Model<GeneratedVideoModel>,
    private readonly videoGeneratorProducer: VideoGeneratorMessagesProducer,
    private readonly sceneInfoService: SceneInfoService,
    private readonly mediaUploadService: MediaUploadService,
    private readonly userMediaService: UserMediaService,
    private readonly logger: Logger,
  ) { }

  public async generateVideoInit(audio: string): Promise<GeneratedVideoModel> {
    return this.generatedVideoModel.create({
      audio: audio,
    });
  }

  public async saveScene(
    originFramePoolInterface: OriginFramePoolInterface,
    frame: FramePoolInterface,
    cutDuration: number,
    fps: number,
    generatedVideoId: string,
  ): Promise<void> {
    const startFrame: number = frame.frame;
    const video: string = frame.video;
    const endFrame: number = startFrame + (cutDuration * fps);
    const framesIncluded: number[] = [];

    originFramePoolInterface[video].forEach((element: any) => {
      if (element.frame >= startFrame && element.frame <= endFrame) {
        framesIncluded.push(element.frame);
      }
    });

    const sceneIds: string[] = await this.sceneInfoService.findIdsByVideoAndFrames(framesIncluded, video);

    await this.generatedVideoModel.updateOne(
      { _id: generatedVideoId },
      { $push: { scenes: { $each: sceneIds } } },
    ).exec();
  }

  public generateFilter(videoInfo: VideoInfoModel | SceneInfoModel): string[] {
    const complexFilter: string[] = ['fps=30'];
    if (videoInfo.size.width !== 1280 || videoInfo.size.height !== 720) {
      const widthScale: number = (videoInfo.size.width / videoInfo.size.height) * 720;
      const heightScale: number = 720;
      complexFilter.push(`scale=w=${widthScale}:h=${heightScale}`);
      complexFilter.push('crop=1280:720:0:0');
    } else {
      complexFilter.push('scale=w=1280:h=720');
    }

    return complexFilter;
  }

  public async generateVideo(
    videoInfo: VideoInfoModel | SceneInfoModel,
    startCutTime: number,
    cutDuration: number,
    tempFolder: string,
    countStrPad: string,
  ): Promise<void> {
    await new Promise((resolve: any, reject: any) => {
      const complexFilter: string[] = this.generateFilter(videoInfo);

      ffmpeg(videoInfo.video)
      .setStartTime(startCutTime)
      .setDuration(cutDuration)
      .on('end', resolve)
      .on('error', reject)
      .complexFilter([complexFilter.join(',')])
      .videoCodec('libx264')
      .noAudio()
      .save(`${tempFolder}/sample-cut-${countStrPad}.mp4`);
    }).catch((err: Error) => {
      this.logger.log(`Error: ${err}`);
      throw err;
    });
  }

  public async mergeScenes(
    type: string,
    businessId: string,
    randomTempFolder: string,
    audio: string,
    generatedVideoId: string,
  ): Promise<void> {
    const randomOutputFile: string = `${randomstring.generate(7)}.mp4`;

    return new Promise((resolve: any, reject: any) => {
      this.logger.log(`Generate ${type}: start merging scenes`);
      const files: string[] = fs.readdirSync(randomTempFolder);
      const chainedInputs: any = files.reduce((result: any, file: string) => result.addInput(`${randomTempFolder}/${file}`), ffmpeg());

      chainedInputs
        .on('end', (): void => {
          resolve();
          rimraf(`${randomTempFolder}`, () => { });
        })
        .on('error', (err: Error): void => {
          reject();
        })
        .mergeToFile(`${os.tmpdir()}/${randomOutputFile}`, os.tmpdir());
    }).then( async () => {
      const tempOutput: string = `${os.tmpdir()}/${randomOutputFile}`;
      let videoInfo: VideoInfoInterface;
      try {
        videoInfo = await VideoHelper.getVideoInfo(tempOutput);
      } catch (err) {
        this.logger.log(`Error 2: ${err}`);
        throw err;
      }

      this.logger.log(`Generate ${type}: start adding audio`);

      await new Promise((resolve: any, reject: any) => {
        ffmpeg(tempOutput)
          .input(audio)
          .duration(videoInfo.duration)
          .on('error', (err: Error) => {
            this.logger.log(`Error: ${err}`);
            reject();
          })
            /* eslint @typescript-eslint/no-misused-promises:0 */
          .on('end', async (): Promise<void> => {
            const video: any = fs.readFileSync(`${os.tmpdir()}/${generatedVideoId}.mp4`);

            let mediaUploadResultDto: MediaUploadResultDto;
            try {
              mediaUploadResultDto = await this.mediaUploadService.uploadVideo(
                video,
                'builder-video',
                businessId,
              );
            } catch (err) {
              this.logger.log(`Error: ${err}`);
              reject();
              throw err;
            }

            await this.generatedVideoModel.updateOne(
              { _id: generatedVideoId },
              { $set: {
                duration: videoInfo.duration,
                previewUrl: mediaUploadResultDto.previewUrl,
                sourceUrl: mediaUploadResultDto.sourceUrl,
              } },
            ).exec();
            await this.userMediaService.create(
              businessId, {
                albumId: null,
                businessId: businessId,
                mediaType: MediaTypeEnum.VIDEO,
                name: 'generate ' + moment().format('LL LTS'),
                url: mediaUploadResultDto.sourceUrl,
              },
              [],
            );

            await this.videoGeneratorProducer.generateVideoFinished(mediaUploadResultDto.sourceUrl, businessId);

            rimraf(`${os.tmpdir()}/${randomOutputFile}`, () => { });
            rimraf(`${os.tmpdir()}/${generatedVideoId}.mp4`, () => { });

            resolve();
            this.logger.log(`Generate ${type}: Video generated !!!`);
          })
          .save(`${os.tmpdir()}/${generatedVideoId}.mp4`);
        });
    }).catch((err: Error) => {
      throw err;
    });
  }
}
