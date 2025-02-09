export enum MessageBusChannelsEnum {
  commerceos = 'async_events_commerceos_micro',
}

export enum AppRegistryEventNameEnum {
  ApplicationInstalled = 'app-registry.event.application.installed',
  ApplicationUnInstalled = 'app-registry.event.application.uninstalled',
}

export enum CommerceosEventNameEnum {
  ApplicationInstalled = 'commerceos.event.application.installed',
  ApplicationUninstalled = 'commerceos.event.application.uninstalled',
  ApplicationsOnboarded = 'commerceos.event.applications.onboarded',
}
