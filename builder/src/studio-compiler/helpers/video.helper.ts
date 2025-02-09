import * as ffmpeg from 'fluent-ffmpeg';

export class VideoHelper {
  public static async getVideoInfo(videoPath: string): Promise<any> {
    return new Promise((resolve: (data: any) => void, reject:  (err: Error) => void) => {
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

  public static generateFilter(videoInfo: any, fps: number, width: number = 1280, height: number = 720): string[] {
    const complexFilter: string[] = [`fps=${fps}`];
    if (videoInfo.size.width < width || videoInfo.size.height < height) {
      complexFilter.push(`scale=${width}:${height}:force_original_aspect_ratio=decrease`);

      let scaleWidth: number = (videoInfo.size.width / videoInfo.size.height) * height;
      scaleWidth = scaleWidth > width ? width : scaleWidth;
      let scaleHeight: number = (videoInfo.size.height / videoInfo.size.width) * width;
      scaleHeight = scaleHeight > height ? height : scaleHeight;

      complexFilter.push(`pad=${width}:${height}:${(width - scaleWidth) / 2}:${(height - scaleHeight) / 2}`);
    } else {
      complexFilter.push(`scale=${width}:${height}:force_original_aspect_ratio=increase`);
      complexFilter.push(`crop=${width}:${height}:${Math.abs(width - videoInfo.size.width) / 4}
      : ${Math.abs(height - videoInfo.size.height) / 4}`);
    }
    complexFilter.push(`setdar=${this.getRatio(width, height)}`);

    return complexFilter;
  }

  private static getRatio(width: number, height: number): string {
    const ratio: number = parseFloat((height / width).toFixed(2));
    const yratio: number = ratio * 100;
    const xratio: number = 100;
    const gcd: number = this.gcd(xratio, yratio);

    return `${ xratio / gcd }/${ yratio / gcd }`;
  }

  private static gcd(x: number, y: number): number {
    while (y !== x) {
      if (x > y) {
        x = x - y;
      } else {
        y = y - x;
      }
    }

    return x;
  }
}
