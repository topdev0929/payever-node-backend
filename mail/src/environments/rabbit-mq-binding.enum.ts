export enum RabbitBinding {
  BusinessCreated = 'users.event.business.created',
  BusinessRemoved = 'users.event.business.removed',
  BusinessUpdated = 'users.event.business.updated',
  BusinessExport = 'users.event.business.export',

  ProductRemoved = 'products.event.product.removed',

  SendEmail = 'mail.event.campaign.send',
  MailRequestTheme = 'mail.event.mail.request.publish.theme',
  ProcessScheduleTheme = 'mail.event.process.schedule.theme',
}
