export enum CommerceOsRmqEventsEnum {
  ApplicationInstalled = 'app-registry.event.application.installed',
  ApplicationUnInstalled = 'app-registry.event.application.uninstalled',
}

export enum ConnectAppRmqEventsEnum {
  ConnectAppEnabled = 'connect.event.third-party.enabled',
  ConnectAppDisabled = 'connect.event.third-party.disabled',
}

export enum ThirdPartyMessenger {
  IntegrationConnected = 'third-party.event.third-party.connected',
  IntegrationDisconnected = 'third-party.event.third-party.disconnected',
}
