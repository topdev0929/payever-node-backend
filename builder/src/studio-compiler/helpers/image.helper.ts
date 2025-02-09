import * as Jimp from 'jimp';
import { ImageInfoInterface } from '../interfaces';

export class ImageHelper {
  public static async getImageInfo(imagePath: string): Promise<ImageInfoInterface> {
    return  Jimp.read(imagePath).then((image: Jimp) => {
      return {
        size: {
          height: image.bitmap.height,
          width: image.bitmap.width,
        },
      };
    });
  }
}
