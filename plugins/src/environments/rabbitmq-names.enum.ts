export enum MessageBusChannelsEnum {
  plugins = 'async_events_plugins_micro',
}

export enum RabbitEventNameEnum {
  BusinessCreated = 'users.event.business.created',
  BusinessRemoved = 'users.event.business.removed',
  BusinessUpdated = 'users.event.business.updated',
  BusinessMigrated = 'monolith.business.migrate',
}

export enum PluginRabbitMessagesEnum {
  PluginExport = 'plugins.event.plugin.export',
  PluginCommandExport = 'plugins.event.plugin-command.export',
  PluginFileExport = 'plugins.event.plugin-file.export',
  PluginInstanceRegistryExport = 'plugins.event.plugin-instance-registry.export',
  ShopSystemExport = 'plugins.event.shop-system.export',
}
