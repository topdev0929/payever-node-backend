export enum RabbitExchangesEnum {
  asyncEvents = 'async_events',
  socialFolders = 'social_folders',
  socialFoldersExport = 'social_folders_export',
}

export enum RabbitChannelsEnum {
  Social = 'async_events_social_micro',
  SocialFolders = 'async_events_social_folders_micro',
  SocialFoldersExport = 'async_events_social_folders_export_micro',
}

export enum RabbitEventNameEnum {
  AppInstalled = 'connect.event.third-party.enabled',
  AppUninstalled = 'connect.event.third-party.disabled',

  BusinessCreated = 'users.event.business.created',
  BusinessUpdated = 'users.event.business.updated',
  BusinessRemoved = 'users.event.business.removed',

  ThirdPartyConnected = 'third-party.event.third-party.connected',
  ThirdPartyDisconnected = 'third-party.event.third-party.disconnected',

  AppRegistryInstalled = 'app-registry.event.application.installed',
  AppRegistryUninstalled = 'app-registry.event.application.uninstalled',

  ChannelSetCreated = 'channels.event.channel-set.created',
  ChannelSetDeleted = 'channels.event.channel-set.deleted',

  ChannelRulesCreated = 'channels.event.channel-rules.created',
  ChannelRulesExported = 'channels.event.channel-rules.exported',
  ChannelRulesDeleted = 'channels.event.channel-rules.deleted',

  UsersEventBusinessExport = 'users.event.business.export',
  UsersEventBusinessUpdated = 'users.event.business.updated',

  CheckoutEventChannelSetByBusinessExport = 'checkout.event.channel-set-by-business.export',
}
