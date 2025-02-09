export enum RabbitEventNameEnum {
  ChannelSetCreated = 'channels.event.channel-set.created',
  ChannelSetDeleted = 'channels.event.channel-set.deleted',
  CheckoutEventChannelSetByBusinessExport = 'checkout.event.channel-set-by-business.export',

  SocialPostCreated = 'social.event.post.created',
  SocialPostUpdated = 'social.event.post.updated',
  SocialPostDeleted = 'social.event.post.deleted',
  SocialPostExported = 'social.event.post.export',
}
