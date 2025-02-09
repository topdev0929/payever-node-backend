export const businessRabbitMqBindings: Array<{ routingKey: string; source: string }> = [
  {
    routingKey: 'users.event.business.created',
    source: 'async_events',
  },
  {
    routingKey: 'users.event.business.removed',
    source: 'async_events',
  },
];
