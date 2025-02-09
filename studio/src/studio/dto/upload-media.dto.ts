import {
  MediaAgesEnum,
  MediaAreasEnum,
  MediaBackgroundEnum,
  MediaBodiesEnum,
  MediaDecadesEnum,
  MediaFormatsEnum,
  MediaKindsEnum,
  MediaPeopleEnum,
  MediaQualityEnum,
  MediaSeasonsEnum,
  MediaSourcesEnum,
  MediaStylesEnum,
  MediaTypesEnum,
} from '../enums/media-properties';

export class UploadMediaDto {
  public path: string;
  public hasPeople: boolean;
  public styles: MediaStylesEnum[];
  public size: number;
  public type: MediaTypesEnum;
  public format: MediaFormatsEnum;
  public area: MediaAreasEnum;
  public themeCategory: string;
  public quality: MediaQualityEnum;
  public source: MediaSourcesEnum;
  public productCategory: string;
  public decade: MediaDecadesEnum;
  public mediaNumber: string;
  public version: number;
  public color: string;
  public people: MediaPeopleEnum;
  public age: MediaAgesEnum;
  public body: MediaBodiesEnum;
  public background: MediaBackgroundEnum;
  public kind: MediaKindsEnum;
  public season: MediaSeasonsEnum;
  public nationality: string;
  public tags: string[];
  public material: string;
  public location: string;
  public isDeleted: boolean;
}
