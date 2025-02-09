import { Injectable } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { CountryCityWallpapersUploader } from '../services';

const FILENAME: string = 'fixtures/cityWallpapers/Cities.xlsx';

@Injectable()
export class UploadWallpapersCommand {
  constructor(
    private readonly uploader: CountryCityWallpapersUploader,
  ) { }

  @Command({
    command: 'country-city-wallpaper:upload',
    describe: 'Upload wallpapers for country-city entity',
  })
  public async upload(): Promise<void> {
    await this.uploader.uploadFromFile(FILENAME);
  }
}
