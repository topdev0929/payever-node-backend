export const SiteDashboardApp: any = {
  _id: 'ec1918b2-2945-4db9-8ff1-851a47d744b1',
  dashboardInfo: {
    title: 'dashboard.apps.site',
    icon: 'icon-commerceos-site-32.png'
  },
  code: 'site',
  tag: '<app-site></app-site>',
  access: {
    admin: {
      defaultInstalled: false,
      isDefault: false
    },
    business: {
      defaultInstalled: false,
      isDefault: false,
      url: '/business/{uuid}/site'
    },
    partner: {
      defaultInstalled: false,
      isDefault: false
    },
    user: {
      defaultInstalled: false,
      isDefault: false
    }
  },
  order: 12,
  bootstrapScriptUrl: '',
  platformHeader: {
    tag: 'pe-platform-header',
    bootstrapScriptUrl: ''
  },
  release: 'Beta',
  allowedAcls: {
    create: true,
    delete: true,
    read: true,
    update: true
  },
  createdAt: new Date(),
  updatedAt: new Date()
};
