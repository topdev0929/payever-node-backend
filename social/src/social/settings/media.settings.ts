import { MimeTypesEnum } from '../enums';

export const videoMimeTypes: MimeTypesEnum[] = [
  MimeTypesEnum.MP4,
  MimeTypesEnum.MOV,
];

export const imageMimeTypes: string[] = [
  MimeTypesEnum.JPG,
  MimeTypesEnum.JPEG,
  MimeTypesEnum.PNG,
  MimeTypesEnum.GIF,
];

export const mediaMimeTypes: string[] = [
  ...videoMimeTypes,
  ...imageMimeTypes,
];
