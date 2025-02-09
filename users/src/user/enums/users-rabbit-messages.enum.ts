export enum UserRabbitMessagesEnum {
  UserRemoved = 'users.event.user.removed',
  UserCreated = 'users.event.user.created',
  UserUpdated = 'users.event.user.updated',
  UserAccountUpdated = 'users.event.user_account.updated',
  ReportDataPrepared = 'users.event.report-data.prepared',
  UserExported = 'users.event.user.export',

  ImportUserFromAuth = 'auth.event.users.export',

  EmployeeRemovedSynced = 'auth.event.employee.removed.synced',
  RpcAuthUserRegistered = 'auth.rpc.user.registered',


  BusinessCurrentWallpaperExported = 'wallpapers.event.business-wallpaper.current-exported',
  BusinessCurrentWallpaperUpdated = 'wallpapers.event.business-wallpaper.current-updated',

  RpcBusinessCurrentWallpaperUpdated = 'wallpapers.rpc.business-wallpaper.current-updated',
  TrustedDomainAdded = 'users.event.trusted-domain.added',
  TrustedDomainDeleted = 'users.event.trusted-domain.deleted',
}
