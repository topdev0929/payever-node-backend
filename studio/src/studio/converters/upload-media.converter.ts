import { UploadMediaDto } from '../dto';
import { MediaTypesEnum } from '../enums/media-properties';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { ThemeCategoryIndustry } from './theme-category-industry.transformer';

export class UploadMediaConverter {
  public static fromXls(xlsData: any, category: string, line: number): UploadMediaDto[] {
    const mediaType: MediaTypesEnum = this.getMediaType(xlsData.Type, line);

    const uploadMediaDto: UploadMediaDto[] = [];
    const areas: string[] = xlsData.Area.toUpperCase().split(';');

    for (const area of areas) {
      const filePath: string = path.join(
        `/storage server/payever media/${category}`,
        area.toLowerCase(),
        mediaType === MediaTypesEnum.Image
          ? 'picture'
          : 'video',
        xlsData['Folder Name'] || '',
        xlsData['Media Name'] || '',
      );

      const mediaNumber: string = xlsData['Media Number']
        ? xlsData['Media Number']
        : uuid();

      uploadMediaDto.push({
        age: xlsData.Age,
        area: xlsData.Area ? xlsData.Area.toLowerCase().split(';') : [],
        background: xlsData.Background,
        body: xlsData.Body,
        color: xlsData.Color,
        decade: xlsData.Decade,
        format: xlsData.Format,
        hasPeople: !!xlsData.People,
        isDeleted: !!xlsData.DELETED,
        kind: xlsData.Kind,
        location: xlsData.Location,
        material: xlsData.Material,
        mediaNumber,
        nationality: xlsData.Nationality,
        path: filePath,
        people: xlsData.People,
        productCategory: xlsData['Product Category'],
        quality: xlsData.Quality,
        season: xlsData.Season,
        size: xlsData['File Size in kb'],
        source: xlsData.Source,
        styles: xlsData.Style ? [xlsData.Style] : [],
        tags: xlsData.Tags ? xlsData.Tags.split(';') : [],
        themeCategory: ThemeCategoryIndustry.transform(xlsData['Theme Category']),
        type: mediaType,
        version: xlsData.Version,
      });
    }

    return uploadMediaDto;
  }

  private static getMediaType(type: string, line: number): MediaTypesEnum {
    switch (type) {
      case 'Picture':
        return MediaTypesEnum.Image;
      case 'Video':
        return MediaTypesEnum.Video;
      default:
        throw new Error(`Unknown media type "${type}" - line: ${line}`);
    }
  }
}
