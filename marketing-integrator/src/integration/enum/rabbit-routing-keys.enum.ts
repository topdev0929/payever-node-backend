export enum RabbitRoutingKeysEnum {
  AccountCreated = 'users.event.user.created',

  ApplicationInstalled = 'app-registry.event.application.installed',
  ApplicationUninstalled = 'app-registry.event.application.uninstalled',

  PaymentCreated = 'checkout.event.payment.created',
}

export const rabbitChannelMarketingIntegrator: string =
  'async_events_marketing_integrator_micro';
