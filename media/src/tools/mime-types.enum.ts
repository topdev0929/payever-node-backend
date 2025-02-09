export enum MimeTypesEnum {
  JPG = 'image/jpg',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  WEBP = 'image/webp',
  SVG = 'image/svg+xml',
  PDF = 'application/pdf',
  MP4 = 'video/mp4',
  MOV = 'video/quicktime',
  AVI_XMSVIDEO = 'video/x-msvideo',
  AVI_VND = 'video/vnd.avi',
  WMV = 'video/x-ms-wmv',
  FLV = 'video/x-flv',
  M4V = 'video/x-m4v',
  WEBM = 'video/webm',

  BIN = 'bin',

  TARGZIP = 'application/tar+gzip',
  XTARGZ = 'application/x-tar-gz',
  GZIP = 'application/gzip',
  ZIP = 'application/zip',
  XZIP = 'application/x-zip-compressed',

  XML = 'application/xml',
  CSV = 'text/csv',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ODS = 'application/vnd.oasis.opendocument.spreadsheet',

  TEXT = 'text/plain',
  HTML = 'text/html',
  STREAM = 'application/octet-stream',
  JAVASCRIPT = 'application/javascript',
}

export const SettingImageMimeTypes: MimeTypesEnum[] = [
  MimeTypesEnum.JPG,
  MimeTypesEnum.JPEG,
  MimeTypesEnum.PNG,
];

export const ImageMimeTypes: MimeTypesEnum[] = [
  MimeTypesEnum.JPG,
  MimeTypesEnum.JPEG,
  MimeTypesEnum.PNG,
  MimeTypesEnum.GIF,
  MimeTypesEnum.SVG,
  MimeTypesEnum.PDF,
  MimeTypesEnum.WEBP,
];

export const VideoMimeTypes: MimeTypesEnum[] = [
  MimeTypesEnum.MP4,
  MimeTypesEnum.MOV,
  MimeTypesEnum.AVI_XMSVIDEO,
  MimeTypesEnum.AVI_VND,
  MimeTypesEnum.WMV,
  MimeTypesEnum.FLV,
  MimeTypesEnum.M4V,
  MimeTypesEnum.WEBM,
];

export const PluginsRelatedMimeTypes: MimeTypesEnum[] = [
  MimeTypesEnum.TARGZIP,
  MimeTypesEnum.XTARGZ,
  MimeTypesEnum.GZIP,
  MimeTypesEnum.ZIP,
  MimeTypesEnum.XZIP,
];
