export enum MessageBusChannelsEnum {
  mailer = 'async_events_mailer_micro',
}

export enum RabbitEventNameEnum {
  PaymentMailSent = 'mailer.event.payment-mail.sent',
  BusinessMailSent = 'mailer.event.business.sent',
}
