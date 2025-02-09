export enum RabbitMessagesEnum {
  BuilderThemePublished = 'builder-site.event.theme.published',
  BuilderThemeComplied = 'builder-site.event.theme.compiled',

  EventApplicationCreated = 'event.application.created',
  EventApplicationRemoved = 'event.application.removed',

  ElasticSingleIndex = 'elastic.single.index',
  ElasticDeleteByQuery = 'elastic.delete.by.query',

  SiteEventThemePublished = 'sites.event.theme.published',
  SiteEventSiteCreated = 'sites.event.site.created',
  SiteEventSiteUpdated = 'sites.event.site.updated',
  SiteEventSiteExport = 'sites.event.site.export',
  SiteEventSiteRemoved = 'sites.event.site.removed',
  SiteEventSiteLiveToggled = 'sites.event.site.live-toggled',
  SiteEventSiteActiveUpdated = 'sites.event.site-active.updated',
  SiteEventPasswordUpdated = 'sites.event.password.updated',
  SiteEventPasswordToggled = 'sites.event.password.toggled',
}
