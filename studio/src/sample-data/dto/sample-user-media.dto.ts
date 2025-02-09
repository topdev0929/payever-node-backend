import { MediaTypeEnum } from '../../studio/enums';

export interface SampleUserMediaDto {
  _id: string;
  url: string;
  mediaType: MediaTypeEnum;
  name: string;
}
