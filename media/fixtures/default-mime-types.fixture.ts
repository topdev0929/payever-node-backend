// tslint:disable: max-line-length

// tslint:disable: max-line-length
import { MimeTypesEnum } from '../src/tools/mime-types.enum';

export const IMAGE_GROUP: string = 'image';
export const VIDEO_GROUP: string = 'video';
export const PLUGINS_RELATED_GROUP: string = 'plugins-related';

export const defaultMimeTypes: any[] = [
  // Image
  { _id: '19fa3d00-130c-11ed-861d-0242ac120002', key: 'JPG', name: MimeTypesEnum.JPG, groups: [IMAGE_GROUP] },
  { _id: '19fa4250-130c-11ed-861d-0242ac120002', key: 'JPEG', name: MimeTypesEnum.JPEG, groups: [IMAGE_GROUP] },
  { _id: '19fa4494-130c-11ed-861d-0242ac120002', key: 'PNG', name: MimeTypesEnum.PNG, groups: [IMAGE_GROUP] },
  { _id: '19fa473c-130c-11ed-861d-0242ac120002', key: 'GIF', name: MimeTypesEnum.GIF, groups: [IMAGE_GROUP] },
  { _id: '19fa5128-130c-11ed-861d-0242ac120002', key: 'SVG', name: MimeTypesEnum.SVG, groups: [IMAGE_GROUP] },
  { _id: '19fa54b6-130c-11ed-861d-0242ac120002', key: 'PDF', name: MimeTypesEnum.PDF, groups: [IMAGE_GROUP] },

  // Video
  { _id: '4b8e3614-130c-11ed-861d-0242ac120002', key: 'MP4', name: MimeTypesEnum.MP4, groups: [VIDEO_GROUP] },
  { _id: '4b8e37b8-130c-11ed-861d-0242ac120002', key: 'MOV', name: MimeTypesEnum.MOV, groups: [VIDEO_GROUP] },
  { _id: '4b8e38a8-130c-11ed-861d-0242ac120002', key: 'AVI_XMSVIDEO', name: MimeTypesEnum.AVI_XMSVIDEO, groups: [VIDEO_GROUP] },
  { _id: '4b8e3998-130c-11ed-861d-0242ac120002', key: 'AVI_VND', name: MimeTypesEnum.AVI_VND, groups: [VIDEO_GROUP] },
  { _id: '4b8e3a74-130c-11ed-861d-0242ac120002', key: 'WMV', name: MimeTypesEnum.WMV, groups: [VIDEO_GROUP] },
  { _id: '4b8e3d76-130c-11ed-861d-0242ac120002', key: 'FLV', name: MimeTypesEnum.FLV, groups: [VIDEO_GROUP] },
  { _id: '4b8e3e5c-130c-11ed-861d-0242ac120002', key: 'M4V', name: MimeTypesEnum.M4V, groups: [VIDEO_GROUP] },

  // Plugins Related
  { _id: '629e19b4-130c-11ed-861d-0242ac120002', key: 'TARGZIP', name: MimeTypesEnum.TARGZIP, groups: [PLUGINS_RELATED_GROUP] },
  { _id: '629e1c66-130c-11ed-861d-0242ac120002', key: 'XTARGZ', name: MimeTypesEnum.XTARGZ, groups: [PLUGINS_RELATED_GROUP] },
  { _id: '629e1d88-130c-11ed-861d-0242ac120002', key: 'GZIP', name: MimeTypesEnum.GZIP, groups: [PLUGINS_RELATED_GROUP] },
  { _id: '629e1e96-130c-11ed-861d-0242ac120002', key: 'ZIP', name: MimeTypesEnum.ZIP, groups: [PLUGINS_RELATED_GROUP] },
  { _id: '629e1fb8-130c-11ed-861d-0242ac120002', key: 'XZIP', name: MimeTypesEnum.XZIP, groups: [PLUGINS_RELATED_GROUP] },

  // 
  { _id: '73a9c730-130c-11ed-861d-0242ac120002', key: 'BIN', name: MimeTypesEnum.BIN, groups: [] },
  { _id: '73a9cabe-130c-11ed-861d-0242ac120002', key: 'XML', name: MimeTypesEnum.XML, groups: [] },
  { _id: '73a9cc62-130c-11ed-861d-0242ac120002', key: 'CSV', name: MimeTypesEnum.CSV, groups: [] },
  { _id: '73a9cdfc-130c-11ed-861d-0242ac120002', key: 'XLSX', name: MimeTypesEnum.XLSX, groups: [] },
  { _id: '73a9d298-130c-11ed-861d-0242ac120002', key: 'ODS', name: MimeTypesEnum.ODS, groups: [] },
];
