import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { GenerateRandomVideoDto, VideoCutDto } from '../dto';
import { ColorHelper, FrameHelper, IndicatorHelper, MathHelper } from '../helpers';
import { FrameInterface, VideoGeneratorInterface, VideoInfoInterface } from '../interfaces';
import { VideoInfoModel } from '../models';
import { VideoInfoSchemaName } from '../schemas';
import * as pixelmatch from 'pixelmatch';
import * as pngjs from 'pngjs';

@Injectable()
export class VideoInfoService {
  constructor(
    @InjectModel(VideoInfoSchemaName) private readonly videoInfoModel: Model<VideoInfoModel>,
    private readonly logger: Logger,
  ) {
  }

  public async updateOrInsert(
    videoPath: string,
    videoInfoData: VideoInfoInterface,
  ): Promise<VideoInfoModel> {
    return  this.videoInfoModel.findOneAndUpdate(
      {
        video: videoPath,
      },
      {
        $set: videoInfoData,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async findByVideos(videoCutDto: VideoCutDto[]): Promise<VideoInfoModel[]> {
    const frameQuery: any[] = [];
    videoCutDto.forEach((element: any) => {
      frameQuery.push({
        video: element.video,
      });
    });

    return this.videoInfoModel.find(
      { $or: frameQuery },
    );
  }

  public async generateVideoInfo(screenshoot: string) : Promise<VideoInfoInterface> {
    this.logger.log(`Processing video: start generating video info`);
    const PNG: any = pngjs.PNG;
    const promise: any[] = [];
    const frames: FrameInterface[] = [
      {
        color: await ColorHelper.averageColor(`${screenshoot}/001.png`),
        frame: 1,
        image: `001.png`,
      },
    ];
    let prevNumDiffPixels: number = 0;

    const files: string[] = fs.readdirSync(screenshoot);
    for (let i: number = 1; i <= files.length; i++) {
      const file: string = `${MathHelper.pad(i, 3)}.png`;

      try {
        const nextImageInt: number = parseInt(file.replace('.png', ''), 10) + 1;
        const nextImage: string = MathHelper.pad(nextImageInt, file.length - 4) + '.png';

        IndicatorHelper.processingIndicator(i);
        const img1: any = PNG.sync.read(fs.readFileSync(`${screenshoot}/${nextImage}`));
        const img2: any = PNG.sync.read(fs.readFileSync(`${screenshoot}/${file}`));
        const { width, height }: any = img1;
        const numDiffPixels: number = this.detectDiffPixel(img1, img2, width, height);

        if (this.isSceneChanged(
          nextImageInt,
          prevNumDiffPixels,
          numDiffPixels,
          width,
          height,
        )) {
          frames.push({
            color: await ColorHelper.averageColor(`${screenshoot}/${nextImage}`),
            frame: nextImageInt,
            image: nextImage,
          });
        }
        prevNumDiffPixels = numDiffPixels;
      } catch (err) {
        this.logger.log(`Error 3: ${err}`);
      }
    }

    frames.sort((a: FrameInterface, b: FrameInterface) => {
      return a.frame - b.frame;
    });

    this.logger.log(`Processing video: finish generating video info`);

    return {
      frames: frames,
    };
  }

  public async findOneByVideo(video: string): Promise<VideoInfoModel> {
    return this.videoInfoModel.findOne({
      video: video,
    });
  }

  public async generateFramePoolInfo(body: GenerateRandomVideoDto): Promise<VideoGeneratorInterface> {
    const framesData: VideoInfoInterface[] = await this.findByVideos(body.videoCutOptions);

    return FrameHelper.generateFramesPoolInfo(
      framesData,
      body.videoCutOptions,
      body.errorMargin,
    );
  }

  private detectDiffPixel(
    img1: any,
    img2: any,
    width: number,
    height: number,
  ): number {
    const PNG: any = pngjs.PNG;
    const diff: any = new PNG({ width, height });

    return pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
  }

  private isSceneChanged(
    nextImageInt: number,
    prevNumDiffPixels: number,
    numDiffPixels: number,
    width: number,
    height: number,
  ): boolean {
    const diffRatio: number = numDiffPixels / (width * height);

    return nextImageInt !== 2
    &&
    ((prevNumDiffPixels / numDiffPixels) < 0.1 && diffRatio > 0.05)
    ||
    ((prevNumDiffPixels / numDiffPixels) < 0.5 && diffRatio > 0.3);
  }
}
