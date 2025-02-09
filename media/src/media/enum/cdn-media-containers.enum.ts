import { MediaContainersEnum } from '@pe/media-sdk';

export enum CdnMediaContainerEnum {
  'Cdn_message-image' = 'cdn/message-image',
  'Cdn_shop-images' = 'cdn/shop-images',
  'Cdn_site-images' = 'cdn/site-images',
  'Cdn_social' = 'cdn/social',
}

export enum CdnContainerEnum {
  Cdn = 'cdn',
}

export enum ArgumentExtraMediaContainerEnum {
  MessageImage = 'message-image',
  Coupons = 'coupons',
  Subscriptions = 'subscriptions',
  Affiliates = 'affiliates',
  Shop = 'shop',
  Site = 'site',
  Invoice = 'invoice',
  Blog = 'blog',
  Appointments = 'appointments',
}

export type ArgumentMediaContainerEnum = MediaContainersEnum | ArgumentExtraMediaContainerEnum;
export const ArgumentMediaContainerEnumObject: { [key: string]: string } = {
  ...MediaContainersEnum,
  ...ArgumentExtraMediaContainerEnum,
};

export type StorageContainerEnum = ArgumentMediaContainerEnum | CdnContainerEnum | CdnMediaContainerEnum;
export const StorageContainerEnumObject: { [key: string]: string } = {
  ...ArgumentMediaContainerEnumObject,
  ...CdnContainerEnum,
  ...CdnMediaContainerEnum,
};

export type MediaArgumentOrCdnContainerEnum = ArgumentMediaContainerEnum | CdnMediaContainerEnum;

export function getCdnContainerName(containerName: ArgumentMediaContainerEnum): CdnMediaContainerEnum {
  return CdnMediaContainerEnum[`Cdn_${containerName}`] || `cdn/${containerName}`;
}
