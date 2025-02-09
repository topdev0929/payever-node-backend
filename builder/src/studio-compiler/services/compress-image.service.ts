import { Injectable } from '@nestjs/common';
import * as imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import * as imageminSvgo from 'imagemin-svgo';
// todo: use this after devops fix
// import * as imageminJpegtran from 'imagemin-jpegtran';
// import * as imageminGifsicle from 'imagemin-gifsicle';

@Injectable()
export class CompressImageService {
  constructor(
  ) {
  }

  public async compress(
    folder: string,
  ): Promise<void> {
    await imagemin([`${folder.replace(/\\/g, '/')}/*.{jpg,png,gif}`], {
      destination: `${folder.replace(/\\/g, '/')}`,
      plugins: [
        // todo: use this after devops fix
        // imageminGifsicle(),
        // imageminJpegtran(),
        imageminPngquant(),
        imageminSvgo(),
      ],
    });
  }
}
