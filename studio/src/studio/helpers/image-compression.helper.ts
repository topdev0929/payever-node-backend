import * as imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';

export class ImageCompressionHelper {
  public static async compress(image: Buffer): Promise<Buffer> {
    return imagemin.buffer(
      image,
      {
        plugins: [
          // todo: need devops to check, build failed
          // imageminJpegtran(),
          imageminPngquant({ dithering: false, speed: 10, strip: true}),
        ],
      },
    );
  }
}
