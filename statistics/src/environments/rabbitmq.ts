export enum MessageBusChannelsEnum {
  statistics = 'async_events_statistics_app_micro',
  statisticsFolders = 'async_events_statistics_folders_micro',
}

export enum RabbitExchangesEnum {
  asyncEvents = 'async_events',
  statisticsFolders = 'statistics_folders',
  statisticsFoldersExport = 'statistics_folders_export',
}

export enum RabbitEventNameEnum {
  BusinessCreated = 'users.event.business.created',
  BusinessUpdated = 'users.event.business.updated',
  BusinessRemoved = 'users.event.business.removed',

  UsersEventBusinessExport = 'users.event.business.export',
}

export enum RabbitChannelsEnum {
  StatisticsFolders = 'async_events_statistics_folders_micro',
  StatisticsFoldersExport = 'async_events_statistics_folders_export_micro',
  StatisticsExport = 'async_events_statistics_export_micro',
}
