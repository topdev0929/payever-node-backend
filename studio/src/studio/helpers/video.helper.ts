import * as ffmpeg from 'fluent-ffmpeg';
import { VideoInfoInterface } from '../interfaces';

export class VideoHelper {
  public static async getVideoInfo(videoPath: string): Promise<VideoInfoInterface> {
    return new Promise((resolve: (data: any) => void, reject:  (err: Error) => void) => {
      /* eslint @typescript-eslint/no-misused-promises:0 */
      ffmpeg(videoPath).ffprobe(0, async (err: Error, data: any): Promise<void> => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }).then( async (data: any) => {
      const fpsArr: string[] = data.streams[0].r_frame_rate.split('/');
      const fps: number = parseInt(fpsArr[0], 10) / parseInt(fpsArr[1], 10);
      const width: number = data.streams[0].width;
      const height: number = data.streams[0].height;
      const sampleAspectRatio: string = data.streams[0].sample_aspect_ratio;
      const displayAspectRatio: string = data.streams[0].display_aspect_ratio;

      return  {
        displayAspectRatio: displayAspectRatio,
        duration: Math.round(data.streams[0].duration),
        fps: Math.round(fps),
        sampleAspectRatio: sampleAspectRatio,
        size: {
          height: height,
          width: width,
        },
      };
    }).catch((err: Error) => {
      throw err;
    });
  }
}
