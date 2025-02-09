import { UploadedImagesHandler, ValidationHandler } from '../handlers';

export const postParseHandlers: any[] = [
  ValidationHandler,
  UploadedImagesHandler,
];
