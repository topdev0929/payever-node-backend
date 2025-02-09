import { MediaUploadTypeEnum } from '../enums';
import { UploadMediaInterface } from './upload-media.interface';

export interface InitMediaPostInterface {
  uploadMedia: UploadMediaInterface[];
  type: MediaUploadTypeEnum;
  postId: string;
}

