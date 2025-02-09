import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { ColorInterface } from './color.interface';

export interface SceneInfoInterface {
  frame: {
    start: number;
    end?: number;
  };
  time: {
    start: number;
    end?: number;
  };
  objectDetection?: {
    start?: cocoSsd.DetectedObject[];
    end?: cocoSsd.DetectedObject[];
  };
  color: {
    start: ColorInterface;
    end?: ColorInterface;
  };
  duration?: number;
  tags?: string[];
  name?: string;
  order: number;
  video: string;
  size?: {
    width?: number;
    height?: number;
  };
  displayAspectRatio?: string;
  sampleAspectRatio?: string;
}
