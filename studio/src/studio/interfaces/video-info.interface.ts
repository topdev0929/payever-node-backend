import { FrameInterface } from './frame.interface';

export interface VideoInfoInterface {
  duration?: number;
  fps?: number;
  frames?: FrameInterface[];
  video?: string;
  size?: {
    width?: number;
    height?: number;
  };
  displayAspectRatio?: string;
  sampleAspectRatio?: string;
}
