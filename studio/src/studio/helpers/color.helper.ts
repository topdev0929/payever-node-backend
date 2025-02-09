import * as ffmpeg from 'fluent-ffmpeg';
import * as Jimp from 'jimp';
import * as rimraf from 'rimraf';
import { ColorInterface } from '../interfaces';
import { MathHelper } from './math.helper';

export class ColorHelper {
  public static async getLastRGBColor(
    videoPath: string,
    timestamps: number,
    filename: string,
    folder: string,
  ): Promise<ColorInterface> {
    return new Promise((resolve: (val: any) => void, reject: () => void) => {
      ffmpeg(videoPath)
        .on('end', resolve)
        .on('error', reject)
        .screenshots({
          filename: filename,
          folder: folder,
          timestamps: [timestamps],
        });
    }).then(async () => {
      const rgb: ColorInterface = await this.averageColor(`${folder}/${filename}`);
      rimraf.sync(`${folder}/${filename}`);

      return rgb;
    }).catch((err: Error) => {
      throw err;
    });
  }

  public static async averageColor(imagePath: string): Promise<ColorInterface> {
    const result: ColorInterface | void =  await Jimp.read(imagePath)
      .then((image: any) => {
        if (!image) {
          return;
        }

        const pixelCount: number = image.bitmap.width * image.bitmap.height;
        let red: number = 0;
        let green: number = 0;
        let blue: number = 0;

        for (let x: number = 0; x < image.bitmap.width; x++) {
          for (let y: number = 0; y < image.bitmap.height; y++) {
            const pixelInt: number = image.getPixelColor(x, y);
            const rgba: any = Jimp.intToRGBA(pixelInt);
            red += rgba.r;
            green += rgba.g;
            blue += rgba.b;
          }
        }

        red = Math.floor(red / pixelCount);
        green = Math.floor(green / pixelCount);
        blue = Math.floor(blue / pixelCount);

        const hex: string =  '#' +
          MathHelper.componentToHex(red) +
          MathHelper.componentToHex(green) +
          MathHelper.componentToHex(blue);

        return {
          blue: blue,
          green: green,
          hex: hex,
          red: red,
        };
      })
      .catch((err: Error) => {
        throw err;
      });

    if (result) {
      return result;
    }
  }
}
