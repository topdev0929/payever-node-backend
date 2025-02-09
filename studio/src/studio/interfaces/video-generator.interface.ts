import { OriginFramePoolInterface, VideoCutDataInterface } from '.';

export interface VideoGeneratorInterface {
  videoCutData: VideoCutDataInterface;
  originFramesPool: OriginFramePoolInterface;
}
