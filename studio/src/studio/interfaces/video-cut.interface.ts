import { FrameInterface } from './frame.interface';

export interface VideoCutDataInterface {
  [key: string]: {
    fps: number;
    videoDuration: number;
    cutDuration?: number;
    noClips?: number;
    errorMargin?: number;
    frames?: FrameInterface[];
  };
}
