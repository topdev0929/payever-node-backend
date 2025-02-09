import { Injectable } from '@nestjs/common';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as fs from 'fs';
import * as pngjs from 'pngjs';
import { MathHelper } from '../helpers';
import { SceneInfoInterface } from '../interfaces';

@Injectable()
export class ObjectDetectionService {
  public cocoSsdModelPromise: Promise<cocoSsd.ObjectDetection>;
  constructor(
  ) {
    this.cocoSsdModelPromise = cocoSsd.load({
      base: 'lite_mobilenet_v2',
    });
  }

  public async detectObjectOnImage(
    sceneInfo: SceneInfoInterface,
    randomTempFolder: string,
  ): Promise<cocoSsd.DetectedObject[][]> {
    const cocoSsdModel: cocoSsd.ObjectDetection = await this.cocoSsdModelPromise;

    const startFramePredictions: cocoSsd.DetectedObject[] = await cocoSsdModel.detect(
      pngjs.PNG.sync.read(fs.readFileSync(
        `${randomTempFolder}/${MathHelper.pad(sceneInfo.frame.start, 3)}.png`,
      )),
    );
    const endFramePredictions: cocoSsd.DetectedObject[] = await cocoSsdModel.detect(
      pngjs.PNG.sync.read(fs.readFileSync(
        `${randomTempFolder}/${MathHelper.pad(sceneInfo.frame.end, 3)}.png`,
      )),
    );

    return [
      startFramePredictions,
      endFramePredictions,
    ];
  }
}
