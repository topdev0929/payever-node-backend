import {
  ColorInterface,
  FrameInterface,
  FramePoolInterface,
  OriginFramePoolInterface,
  SceneInfoInterface,
  VideoCutDataInterface,
  VideoGeneratorInterface,
  VideoInfoInterface,
} from '../interfaces';
import { SceneInfoModel } from '../models';
import { ColorHelper } from './color.helper';
import { MathHelper } from './math.helper';

export class FrameHelper {
  public static getClosestRelatedFrameOrScene(
    framesPool: FramePoolInterface[] | SceneInfoModel[],
    lastRGB: ColorInterface,
  ): FramePoolInterface | SceneInfoModel {
    const framesToSort: Array<(FramePoolInterface | SceneInfoModel)> = [...framesPool].sort((
      a: FramePoolInterface | SceneInfoModel,
      b: FramePoolInterface | SceneInfoModel,
    ): number => {

      return this.extractColorRGB(a, lastRGB) - this.extractColorRGB(b, lastRGB);
    });

    return framesToSort[0];
  }

  public static getFrameOrScene(
    pool: FramePoolInterface[] | SceneInfoModel[],
    count?: number,
    lastRGB?: ColorInterface,
  ): FramePoolInterface | SceneInfoModel  {
    let frameOrScene: FramePoolInterface | SceneInfoModel;
    if (count === 1 || !lastRGB) {
      frameOrScene = pool[Math.floor(parseFloat('0.' + crypto.getRandomValues(new Uint32Array(1))[0]) * pool.length)];
    } else {
      frameOrScene = FrameHelper.getClosestRelatedFrameOrScene(pool, lastRGB);
    }

    return frameOrScene;
  }

  public static generateFramesPool(
    videoCutData: VideoCutDataInterface,
    originFramesPool: OriginFramePoolInterface,
    framesPool: FramePoolInterface[] = [],
  ): FramePoolInterface[] {
    if (!framesPool || framesPool.length === 0) {
      for (const key in videoCutData) {
        if (videoCutData[key].noClips > 0) {
          framesPool = framesPool.concat(originFramesPool[key]);
        }
      }
    }

    return framesPool;
  }

  public static removeUnavailableFrame(
    framesPool: FramePoolInterface[],
    startCutTime: number,
    cutDuration: number,
    video: string,
    currentVideoCutData: any,
  ): FramePoolInterface[] {
    const fps: number = currentVideoCutData.fps;
    const noClipsComplete: boolean = currentVideoCutData.noClips === 0;
    for (let i: number = framesPool.length - 1; i >= 0; i--) {
      if (noClipsComplete && framesPool[i].video === video) {
        framesPool.splice(i, 1);
      } else {
        const endFrameToRemove: number = (startCutTime + cutDuration) * fps;
        const startFrameToRemove: number = (startCutTime - cutDuration) * fps;
        framesPool = this.removeFrameFromPool(
          framesPool,
          i,
          startFrameToRemove,
          endFrameToRemove,
          video,
        );
      }
    }

    return framesPool;
  }

  public static getLastFrameToCut(
    availableDuration: number,
    targetDuration: number,
    fps: number,
  ): number {
    return (availableDuration - targetDuration) * fps;
  }

  public static generateFramesPoolInfo(
    framesData: VideoInfoInterface[],
    videoCutOptions: any,
    errorMargin: number,
  ): VideoGeneratorInterface {
    const videoCutData: VideoCutDataInterface = { };
    const originFramesPool: OriginFramePoolInterface = { };

    framesData.forEach((element: VideoInfoInterface) => {
      videoCutData[element.video] = ({
        fps: element.fps,
        frames: element.frames,
        videoDuration: element.duration,
      });
    });

    videoCutOptions.forEach((element2: any) => {
      videoCutData[element2.video].cutDuration = element2.duration;
      videoCutData[element2.video].errorMargin =
        Math.ceil(element2.duration * errorMargin / 100 * videoCutData[element2.video].fps);
      videoCutData[element2.video].noClips = element2.noClips;

      const lastFrameToCut: number = FrameHelper.getLastFrameToCut(
        videoCutData[element2.video].videoDuration,
        element2.duration,
        videoCutData[element2.video].fps,
      );
      const allFrames: FrameInterface[] = FrameHelper.removeFramesAfterLastAvailableFrame(
        lastFrameToCut,
        videoCutData[element2.video].frames,
      );

      allFrames.forEach((element3: FrameInterface): any => {
        const OriginFramePoolData: any = {
          color: element3.color,
          frame: element3.frame,
          video: element2.video,
        };
        if (originFramesPool[OriginFramePoolData.video]) {
          originFramesPool[element2.video].push(OriginFramePoolData);
        } else {
          originFramesPool[element2.video] = [OriginFramePoolData];
        }
      });
    });

    return {
      originFramesPool: originFramesPool,
      videoCutData: videoCutData,
    };
  }

  public static removeSceneFromPool(
    scene: SceneInfoModel,
    scenePool: SceneInfoModel[],
  ): SceneInfoModel[] {
    const scenePoolToRemove: SceneInfoModel[] = [...scenePool];

    for (let i: number = scenePoolToRemove.length - 1; i >= 0; i--) {
      if (scenePool[i]._id === scene._id) {
        scenePoolToRemove.splice(i, 1);
      }
    }

    return scenePoolToRemove;
  }

  public static hasClipLeft(videoCutData: VideoCutDataInterface): boolean {
    let noClipsLeft: number = 0;
    for (const key in videoCutData) {
      if (videoCutData[key].noClips > 0) {
        noClipsLeft += videoCutData[key].noClips;
      }
    }

    return noClipsLeft > 0;
  }

  public static async getNewCutDuration(
    startCutTime: number,
    cutDuration: number,
    currentVideoCutData: any,
    framesPool: FramePoolInterface[],
    randomStartFrame: FramePoolInterface,
    tempFolder: string,
    videoCutData: VideoCutDataInterface,
  ): Promise<number> {
    const bestFrameToCut: FramePoolInterface = await this.searchClosestFrameByMargin(
      startCutTime,
      cutDuration,
      currentVideoCutData,
      framesPool,
      randomStartFrame.video,
      tempFolder,
      videoCutData,
    );

    const newCutDuration: number = (bestFrameToCut) ?
      (bestFrameToCut.frame - randomStartFrame.frame) / currentVideoCutData.fps : cutDuration;

    return MathHelper.toTwoDecimalDigit(newCutDuration);
  }

  private static async searchClosestFrameByMargin(
    startCutTime: number,
    cutDuration: number,
    currentVideoCutData: any,
    framesPool: FramePoolInterface[],
    video: string,
    tempFolder: string,
    videoCutData: VideoCutDataInterface,
  ): Promise<FramePoolInterface> {
    const endCutFrame: number = (startCutTime + cutDuration) * currentVideoCutData.fps;
    const endFrameMargin: any = {
      next: Math.ceil(endCutFrame + currentVideoCutData.errorMargin),
      prev: Math.floor(endCutFrame - currentVideoCutData.errorMargin),
    };
    const fps: number = videoCutData[video].fps;
    const closeFrames: Array<{
      diffValue: number;
      frame: FramePoolInterface;
    }> = [];

    for (let i: number = framesPool.length - 1; i >= 0; i--) {
      if (
        framesPool[i].video === video &&
        framesPool[i].frame >= endFrameMargin.prev &&
        framesPool[i].frame <= endFrameMargin.next
      ) {
        const timestamps: number = (framesPool[i].frame - 1) / fps;
        const rgb: ColorInterface = await ColorHelper.getLastRGBColor(
          video,
          timestamps,
          `frame-${framesPool[i].frame}.png`,
          tempFolder,
        );

        const framesPoolToSearch: FramePoolInterface[] =
          FrameHelper.removeIntersectPreviousFrame(
            framesPool,
            framesPool[i].frame,
            framesPool[i].video,
            videoCutData,
          );
        const closestFrame: FramePoolInterface =
          FrameHelper.getClosestRelatedFrameOrScene(framesPoolToSearch, rgb) as FramePoolInterface;

        const diffValue: number = Math.abs(rgb.red - closestFrame.color.red) +
          Math.abs(rgb.green - closestFrame.color.green) +
          Math.abs(rgb.blue - closestFrame.color.blue);

        closeFrames.push({
          diffValue: diffValue,
          frame: framesPool[i],
        });
      }
    }

    const closeFramesSorted: Array<{
      diffValue: number;
      frame: FramePoolInterface;
    }> = [...closeFrames].sort((a: any, b: any): number => {

      return a.diffValue - b.diffValue;
    });

    return closeFramesSorted[0]?.frame;
  }

  private static removeFramesAfterLastAvailableFrame(
    lastFrameToCut: number,
    frames: FrameInterface[],
  ): FrameInterface[] {
    const allFrames: FrameInterface[] = [...frames];
    for (let i: number = allFrames.length - 1; i >= 0; i--) {
      if (allFrames[i].frame >= lastFrameToCut) {
        allFrames.splice(i, 1);
      }
    }

    return allFrames;
  }

  private static removeIntersectPreviousFrame(
    framesPool: FramePoolInterface[],
    frameNumber: number,
    video: string,
    videoCutData: VideoCutDataInterface,
  ): FramePoolInterface[] {
    const framesCountDuration: number = videoCutData[video].cutDuration * videoCutData[video].fps;
    let framesPoolToRemove: FramePoolInterface[] = [...framesPool];

    for (let i: number = framesPoolToRemove.length - 1; i >= 0; i--) {
      const startFrameToRemove: number = frameNumber - framesCountDuration;
      framesPoolToRemove = this.removeFrameFromPool(
        framesPoolToRemove,
        i,
        startFrameToRemove,
        frameNumber,
        video,
      );
    }

    return framesPoolToRemove;
  }

  private static removeFrameFromPool(
    framesPool: FramePoolInterface[],
    index: number,
    startFrameToRemove: number,
    endFrameToRemove: number,
    video: string,
  ): any {
    if (
      framesPool[index].frame >= startFrameToRemove
      && framesPool[index].frame <= endFrameToRemove
      && framesPool[index].video === video
    ) {
      framesPool.splice(index, 1);
    }

    return framesPool;
  }

  private static extractColorRGB(
    color: FramePoolInterface | SceneInfoInterface,
    lastRGB: ColorInterface,
  ): number {
    const red: number = ('start' in color.color) ? color.color.start.red : color.color.red;
    const green: number = ('start' in color.color) ? color.color.start.green : color.color.green;
    const blue: number = ('start' in color.color) ? color.color.start.blue : color.color.blue;

    return Math.abs(red - lastRGB.red) +
      Math.abs(green - lastRGB.green) +
      Math.abs(blue - lastRGB.blue);
  }
}
