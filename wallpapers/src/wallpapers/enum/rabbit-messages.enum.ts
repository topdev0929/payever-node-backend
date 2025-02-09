export enum MessageBusChannelsEnum {

}

export enum RabbitChannelsEnum {
  Wallpapers = 'async_events_wallpapers_micro',
  WallpapersFolders = 'async_events_wallpapers_folders_micro',
}

export enum RabbitExchangesEnum {
  asyncEvents = 'async_events',
  wallpapersFolders = 'wallpapers_folders',
}

export const enum RabbitMessages {
  BusinessProductExported = 'wallpapers.event.business-product.exported',
  CountryCityWallpaperExported = 'wallpapers.event.country-city-wallpaper.exported',
  BusinessWallpaperExported = 'wallpapers.event.business-wallpaper.current-exported',
  BusinessWallpaperUpdated = 'wallpapers.event.business-wallpaper.current-updated',

  RpcBusinessWallpaperUpdated = 'wallpapers.rpc.business-wallpaper.current-updated',
  MergeDuplicateUsers = 'user.event.merge.duplicate',
}
