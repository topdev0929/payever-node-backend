import { MediaTypeEnum } from '../enums';

export interface UploadMediaInterface {
  request?: any;
  bufferPath: string;
  startOffset?: string;
  segmentIndex: string;
  variables?: { [key: string]: string };
  uploadUrl?: string;
  headers?: string;
  parameters?: string;
  type: MediaTypeEnum;
}
