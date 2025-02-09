export const integrationRabbitMqBindings: Array<{ routingKey: string; source: string }> = [
  {
    routingKey: 'connect.event.third-party.enabled',
    source: 'async_events',
  },
  {
    routingKey: 'connect.event.third-party.disabled',
    source: 'async_events',
  },
];
