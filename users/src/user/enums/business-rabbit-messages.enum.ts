export enum MessageBusChannelsEnum {
  users = 'async_events_users_micro',
}

export enum BusinessRabbitMessagesEnum {
  BusinessCreated = 'users.event.business.created',
  BusinessUpdated = 'users.event.business.updated',
  BusinessRemoved = 'users.event.business.removed',
  BusinessExport = 'users.event.business.export',
  BusinessOwnerMigrate = 'users.event.business.owner-migrate',
  BusinessOwnerTransfer = 'users.event.business.owner-transfer',

  RpcBusinessCreated = 'users.rpc.business.created',
}

export enum BusinessRabbitSecretMessagesEnum {
  BusinessEmailSettingsUpdated = 'users.event.business.secrets.email-settings.updated',
}
