export enum AffiliatesRabbitMessagesEnum {
  BusinessAffiliateCreated = 'affiliate.event.business-affiliate.created',
  BusinessAffiliateDeleted = 'affiliate.event.business-affiliate.deleted',

  AffiliateProgramCreated = 'affiliate.event.affiliate-program.created',
  AffiliateProgramUpdated = 'affiliate.event.affiliate-program.updated',
  AffiliateProgramRemoved = 'affiliate.event.affiliate-program.removed',
  AffiliateProgramExported = 'affiliate.event.affiliate-program.export',

  AffiliateBrandingCreated = 'affiliate.event.affiliate-branding.created',
  AffiliateBrandingUpdated = 'affiliate.event.affiliate-branding.updated',
  AffiliateBrandingRemoved = 'affiliate.event.affiliate-branding.removed',
  AffiliateBrandingExported = 'affiliate.event.affiliate-branding.export',

  AffiliateThemePublished = 'affiliate.event.theme.published',
  AffiliateThemePublishedAllPages = 'affiliate.event.theme.published.all.pages',
}
