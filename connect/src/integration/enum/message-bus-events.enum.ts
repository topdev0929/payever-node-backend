  export enum MessageBusEventsEnum {
    ThirdPartyEnabled = 'third-party.event.third-party.enabled',
    ThirdPartyDisabled = 'third-party.event.third-party.disabled',

    ThirdPartyConnected = 'third-party.event.third-party.connected',
    ThirdPartyDisconnected = 'third-party.event.third-party.disconnected',

    ThirdPartyAuthEnabled = 'third-party.event.third-party.auth.enabled',
    ThirdPartyAuthDisabled = 'third-party.event.third-party.auth.disabled',

    ThirdPartyExported = 'connect.event.third-party.exported',

    ConnectIntegrationCreated = 'connect.event.integration.created',
    ConnectIntegrationUpdated = 'connect.event.integration.updated',
    ConnectIntegrationDeleted = 'connect.event.integration.deleted',
    ConnectIntegrationExported = 'connect.event.integration.exported',
    ConnectIntegrationSync = 'connect.event.integration.sync',

    ConnectIntegrationSubscriptionCreated = 'connect.event.integration.subscription.created',
    ConnectIntegrationSubscriptionUpdated = 'connect.event.integration.subscription.updated',
    ConnectIntegrationSubscriptionDeleted = 'connect.event.integration.subscription.deleted',
    ConnectIntegrationSubscriptionExported = 'connect.event.integration.subscription.exported',

    AppCreated = 'apps.event.app.created',
    AppUpdated = 'apps.event.app.updated',
    AppDeleted = 'apps.event.app.deleted',
    AppExported = 'apps.event.app.exported',

    OnboardingSetupConnect = 'onboarding.event.setup.connect'
  }
