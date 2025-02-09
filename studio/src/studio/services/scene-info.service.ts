import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { GetSceneInfoDto, UpdateSceneInfoDto } from '../dto';
import { ColorHelper, IndicatorHelper, MathHelper, PaginationHelper } from '../helpers';
import { PaginationInterface, SceneInfoInterface, VideoInfoInterface } from '../interfaces';
import { SceneInfoModel } from '../models';
import { SceneInfoSchemaName } from '../schemas';
import { ObjectDetectionService } from './object-detection.service';

@Injectable()
export class SceneInfoService {
  constructor(
    @InjectModel(SceneInfoSchemaName) private readonly sceneInfoModel: Model<SceneInfoModel>,
    private readonly objectDetectionService: ObjectDetectionService,
    private readonly logger: Logger,
  ) { }

  public async update(
    sceneInfoId: string,
    dto: UpdateSceneInfoDto,
  ): Promise<SceneInfoModel> {

    return this.sceneInfoModel.findOneAndUpdate(
      {
        _id: sceneInfoId,
      },
      {
        $set: dto,
      },
      {
        new: true,
        upsert: false,
      },
    );
  }

  public async remove(
    sceneInfoModel: SceneInfoModel,
  ): Promise<void> {
    await this.sceneInfoModel.deleteOne({ _id: sceneInfoModel._id }).exec();
  }

  public async findByVideo(
    sceneInfoByVideo: GetSceneInfoDto,
  ): Promise<SceneInfoModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(sceneInfoByVideo);

    return this.sceneInfoModel.find({
      video: sceneInfoByVideo.video,
    })
    .sort({ order: 1 })
    .skip(page.skip).limit(page.limit);
  }

  public async findIdsByVideoAndFrames(
    framesIncluded: number[],
    video: string,
  ): Promise<string[]> {
    const scenesIncluded: SceneInfoModel[] = await this.sceneInfoModel.find({
      'frame.start': { '$in' : framesIncluded },
      video: video,
    }).select('_id').exec();

    const sceneIds: string[] = [];

    scenesIncluded.forEach((element: SceneInfoModel) => {
      sceneIds.push(element._id);
    });

    return sceneIds;
  }

  public async generateSceneInfo(
    randomTempFolder: string,
    videoInfoData: VideoInfoInterface,
    video: string,
  ): Promise<void> {
    this.logger.log(`Processing video: start generating scene info`);
    const ScenesInfos: SceneInfoInterface[] = await this.generateSceneInfoInterfaces(
      videoInfoData,
      video,
      randomTempFolder,
    );

    this.logger.log(`Processing video: saving scene info`);
    let x: number = 0;
    for (const sceneInfo of ScenesInfos) {
      IndicatorHelper.processingIndicator(x);
      x++;

      sceneInfo.duration = sceneInfo.time.end - sceneInfo.time.start;

      const predictions: cocoSsd.DetectedObject[][] =
        await this.objectDetectionService.detectObjectOnImage(sceneInfo, randomTempFolder);

      sceneInfo.objectDetection = {
        end: predictions[1],
        start: predictions[0],
      };

      await this.updateOrInsert(sceneInfo);
    }
    this.logger.log(`Processing video: finish generating scene info`);
  }

  public async getScenePool(tags: string[]): Promise<SceneInfoModel[]> {

    const query: any = [];
    for (const tag of tags) {
      query.push(
        {
          $and: [
            { 'objectDetection.end.score' : { $gte : 0.7 }},
            { 'objectDetection.end.class' : tag },
          ],
        },
      );
    }

    return this.sceneInfoModel.find({
      $and: [
        { $or : query },
        { duration: { $gt: 0.5}},
      ],
    });
  }

  private async generateSceneInfoInterfaces(
    videoInfoData: VideoInfoInterface,
    video: string,
    randomTempFolder: string,
  ): Promise<SceneInfoInterface[]> {
    let ScenesInfos: SceneInfoInterface[] = [];
    let sceneOrder: number = 0;

    for (let i: number = 0; i < videoInfoData.frames.length; i++) {
      sceneOrder++;

      ScenesInfos = await this.generateSingleSceneInfoInterface(
        randomTempFolder,
        videoInfoData,
        ScenesInfos,
        sceneOrder,
        video,
        i,
      );
    }

    const files: string[] = fs.readdirSync(randomTempFolder);
    ScenesInfos[ScenesInfos.length - 1].frame.end = files.length;
    ScenesInfos[ScenesInfos.length - 1].time.end = files.length / videoInfoData.fps;
    const lastFrame: string = MathHelper.pad(files.length, 3) + '.png';
    ScenesInfos[ScenesInfos.length - 1].color.end = await ColorHelper.averageColor(`${randomTempFolder}/${lastFrame}`);

    return ScenesInfos;
  }

  private async generateSingleSceneInfoInterface(
    randomTempFolder: string,
    videoInfoData: VideoInfoInterface,
    ScenesInfos: SceneInfoInterface[],
    sceneOrder: number,
    video: string,
    index: number,
  ): Promise<SceneInfoInterface[]> {
    IndicatorHelper.processingIndicator(index);

    const sceneInfo: SceneInfoInterface = {
      color: {
        start: videoInfoData.frames[index].color,
      },
      displayAspectRatio: videoInfoData.displayAspectRatio,
      frame: {
        start: videoInfoData.frames[index].frame,
      },
      order: sceneOrder,
      sampleAspectRatio: videoInfoData.sampleAspectRatio,
      size: videoInfoData.size,
      time: {
        start: (videoInfoData.frames[index].frame - 1) / videoInfoData.fps,
      },
      video: video,
    };
    ScenesInfos.push(sceneInfo);

    if (index !== 0) {
      ScenesInfos[index - 1].frame.end = videoInfoData.frames[index].frame - 1;
      ScenesInfos[index - 1].time.end = (videoInfoData.frames[index].frame - 2) / videoInfoData.fps;

      const prevImageInt: number = parseInt(videoInfoData.frames[index].image.replace('.png', ''), 10) - 1;
      const prevImage: string = MathHelper.pad(prevImageInt, videoInfoData.frames[index].image.length - 4) + '.png';
      ScenesInfos[index - 1].color.end = await ColorHelper.averageColor(`${randomTempFolder}/${prevImage}`);
    }

    return ScenesInfos;
  }

  private async updateOrInsert(
    sceneInfo: SceneInfoInterface,
  ): Promise<SceneInfoModel> {
    return this.sceneInfoModel.findOneAndUpdate(
      {
        order: sceneInfo.order,
        video: sceneInfo.video,
      },
      {
        $set: sceneInfo,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }
}
