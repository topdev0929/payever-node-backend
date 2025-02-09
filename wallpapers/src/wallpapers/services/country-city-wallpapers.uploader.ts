import { Injectable, Logger } from '@nestjs/common';
import { MediaUploadResultDto, UploadCountryCityWallpapersDto } from '../dto';
import { readFileSync } from 'fs';
import * as XLSX from 'xlsx';
import { environment } from '../../environments';
import { CountryCityWallpapersService } from './country-city-wallpapers.service';
import { CountryInfoService } from './country-info.service';
import { DropboxClient } from './dropbox.client';
import { UploadCountryCityWallpapersConverter } from '../converters';
import { ImageProcessor } from './image.processor';

@Injectable()
export class CountryCityWallpapersUploader {
  private dropBoxAccessToken: string;

  constructor(
    private readonly countryCityWallpapersService: CountryCityWallpapersService,
    private readonly countryInfoService: CountryInfoService,
    private readonly imageProcessor: ImageProcessor,
    private readonly dropbox: DropboxClient,
    private readonly logger: Logger,
  ) {
    this.dropBoxAccessToken = environment.dropBoxAccessToken;
  }

  public async uploadFromFile(filePath: string): Promise<void> {
    const mediaList: UploadCountryCityWallpapersDto[] = await this.getMediaList(filePath);
    for (const media of mediaList) {
      const pathFile: string = media.path.trim();

      const isWallpaperExists: boolean = await this.countryCityWallpapersService
        .isWallpaperExists({ city: media.city, country: media.country });
      
      if (isWallpaperExists) {
        continue;
      }

      try {
        this.logger.log(`Start download file: ${pathFile}`);
        const tmpFile: string = await this.dropbox.downloadToTemporaryFile(pathFile);

        this.logger.log(`Start upload file: ${pathFile}`);
        const uploadedFile: MediaUploadResultDto = await this.imageProcessor.upload(tmpFile, 'image');
        this.logger.log(`Save file: ${pathFile}`);
        await this.saveUploadedMedia(media, uploadedFile);
      } catch (error) {
        this.logger.error(error);
        this.logger.log(`Error at file: ${pathFile}: ${JSON.stringify(error)}`);
      }
    }
  }

  private async getMediaList(filePath: string): Promise<UploadCountryCityWallpapersDto[]> {
    const fileSource: any = readFileSync(filePath);
    const workbook: XLSX.WorkBook = XLSX.read(fileSource, { type: 'buffer' });

    const sheetNames: string[] = workbook.SheetNames.filter(
      (name: string) => name.includes('Wallpapers'),
    );
    const result: UploadCountryCityWallpapersDto[] = [];
    for (const sheetName of sheetNames) {
      const list: any = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      for (const xlsData of list) {
        const wallpaper: UploadCountryCityWallpapersDto = UploadCountryCityWallpapersConverter.fromXls(xlsData);
        if (wallpaper) {
          result.push(wallpaper);
        }
      }
    }

    return result;
  }

  private async saveUploadedMedia(
    media: UploadCountryCityWallpapersDto,
    uploadedFile: MediaUploadResultDto,
  ): Promise<void> {
    const wallpaperId: string = uploadedFile.sourceUrl.substr(uploadedFile.sourceUrl.lastIndexOf('/') + 1);
    await this.countryCityWallpapersService.create({
      city: media.city,
      country: this.countryInfoService.getCountryCode(media.country) || media.country,
      fullPath: uploadedFile.sourceUrl,
      wallpaper: {
        theme: uploadedFile.brightness,
        wallpaper: wallpaperId,
      },
    });
  }
}
