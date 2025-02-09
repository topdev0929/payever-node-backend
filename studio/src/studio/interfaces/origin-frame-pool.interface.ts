import { ColorInterface } from './color.interface';

export interface OriginFramePoolInterface {
  [key: string]: [{
    frame: number;
    color: ColorInterface;
    video: string;
  }];
}
