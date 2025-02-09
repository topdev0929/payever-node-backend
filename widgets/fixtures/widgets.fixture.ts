// tslint:disable
export const widgetsFixture: any[] = [
  {
    _id : '7ef6a850-ed59-41cc-9c6e-85bf6d0a310d',
    type : 'tutorial',
    icon : '#icon-commerceos-tutorial',
    title : 'Tutorial',
    default : false,
    tutorial : {
      showOnTutorial : false,
      title : 'payever CommerceOS',
      icon : '#icon-apps-apps',
      url : 'https://getpayever.com/help/dashboard/',
      urls : [ 
        {
          language : 'en',
          url : 'https://support.payever.org/hc/en-us/articles/360013450500-How-to-navigate-payever-Dashboard'
        }, 
        {
          language : 'de',
          url : 'https://support.payever.org/hc/de/articles/360013450500-Wie-steuern-Sie-Ihr-payever-Dashboard'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 110,
    createdAt : '2019-01-28T18:27:52.014',
    updatedAt : '2019-01-28T18:27:52.014',
    __v : 0,
    installByDefault: false,
  },
  {
    _id : '00e42593-2b79-4f29-82e0-9175c80b263f',
    type : 'apps',
    title : 'Apps',
    default : true,
    tutorial : {
      showOnTutorial : false,
      title : 'payever Apps',
      icon : '#icon-apps-payments',
      url : 'https://getpayever.com/help/checkout/',
      urls : [],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 250,
    createdAt : '2019-01-28T18:27:52.014',
    updatedAt : '2019-01-28T18:27:52.014',
    __v : 0,
    helpUrl : 'https://getpayever.com/apps/',
    icon : '#icon-commerceos-apps',
    installByDefault: true,
  },
  {
    _id : 'b33845b0-9798-4980-ae0c-8585b1cef2cb',
    __v : 0,
    createdAt : '2020-08-10T09:45:36.892',
    default : false,
    icon : '#icon-commerceos-subscriptions',
    order : 120,
    title : 'Subscriptions',
    tutorial : {
      icon : '',
      title : 'Subscriptions',
      url : 'default',
      urls : [ 
        {
          language : 'en',
          url : 'https://getpayever.com/site/'
        }, 
        {
          language : 'de',
          url : 'https://getpayever.com/site/'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    type : 'subscriptions',
    updatedAt : '2020-08-10T09:45:36.892',
    installByDefault: false,
  },
  {
    _id : 'c4a68f1e-e8ac-418c-a6d0-acc1e906d9a9',
    type : 'pos',
    icon : '#icon-commerceos-pos',
    title : 'Point of sale',
    default : false,
    tutorial : {
      showOnTutorial : true,
      title : 'payever Point of sale',
      icon : '#icon-apps-pos',
      url : 'https://getpayever.com/help/point-of-sale/',
      urls : [ 
        {
          language : 'en',
          url : 'https://support.payever.org/hc/en-us/articles/360023894694-How-to-setup-a-POS-terminal'
        }, 
        {
          language : 'de',
          url : 'https://support.payever.org/hc/de/articles/360023894694-Wie-richte-ich-ein-PoS-Terminal-ein-'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 200,
    createdAt : '2019-01-28T18:27:52.014',
    updatedAt : '2019-01-28T18:27:52.014',
    __v : 0,
    helpUrl : 'https://getpayever.com/pos',
    installByDefault: false,
  },
  {
    _id : 'fe7d398c-194c-46ca-b00a-943d928919ba',
    type : 'products',
    icon : '#icon-commerceos-products',
    title : 'Products',
    default : false,
    tutorial : {
      showOnTutorial : true,
      title : 'payever Products',
      icon : '#icon-apps-products',
      url : 'https://getpayever.com/help/products/',
      urls : [ 
        {
          language : 'en',
          url : 'https://support.payever.org/hc/en-us/articles/360024064893-How-to-setup-products'
        }, 
        {
          language : 'de',
          url : 'https://support.payever.org/hc/de/articles/360024064893-Wie-erstelle-ich-Produkte-'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 220,
    createdAt : '2019-01-28T18:27:52.014',
    updatedAt : '2019-01-28T18:27:52.014',
    __v : 0,
    helpUrl : 'https://getpayever.com/products/',
    installByDefault: false,
  },
  {
    _id : '336dcace-9249-40e4-94c8-b277a2bb3901',
    type : 'studio',
    icon : '#icon-commerceos-studio',
    title : 'Payever Studio',
    default : false,
    tutorial : {
      showOnTutorial : true,
      title : 'payever Point of sale',
      icon : '#icon-apps-studio',
      urls : [ 
        {
          language : 'en',
          url : 'https://support.payever.org/hc/en-us/articles/360023894814-How-to-get-started-with-payever-Studio'
        }, 
        {
          language : 'de',
          url : 'https://support.payever.org/hc/de/articles/360023894814-Wie-kann-ich-payever-Studio-nutzen-'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 190,
    createdAt : '2019-11-28T17:27:49.485',
    updatedAt : '2019-11-28T17:27:49.485',
    __v : 0,
    installByDefault: false,
  },
  {
    _id : '35c33640-cc49-47f3-b137-f6c0a110ae0a',
    type : 'connect',
    icon : '#icon-commerceos-connect',
    title : 'Connect',
    default : false,
    tutorial : {
      showOnTutorial : true,
      title : 'payever Connect',
      icon : '#icon-apps-app-market',
      url : 'https://getpayever.com/help/connect/',
      urls : [ 
        {
          language : 'en',
          url : 'https://support.payever.org/hc/en-us/articles/360013449980-How-to-set-up-payever-Connect'
        }, 
        {
          language : 'de',
          url : 'https://support.payever.org/hc/de/articles/360013449980-Wie-richte-ich-payever-Connect-ein'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 230,
    createdAt : '2019-01-28T18:27:52.014',
    updatedAt : '2019-01-28T18:27:52.014',
    __v : 0,
    helpUrl : 'https://getpayever.com/connect/',
    installByDefault: false,
  },
  {
    _id : '24568b8d-2fbb-43cf-9ef1-9e1523219e32',
    type : 'transactions',
    icon : '#icon-commerceos-transactions',
    title : 'Transactions',
    default : false,
    tutorial : {
      showOnTutorial : true,
      title : 'payever Transactions',
      icon : '#icon-apps-orders',
      url : 'https://getpayever.com/help/transactions/',
      urls : [ 
        {
          language : 'en',
          url : 'https://support.payever.org/hc/en-us/articles/360013450280-How-to-set-up-payever-Transactions'
        }, 
        {
          language : 'de',
          url : 'https://support.payever.org/hc/de/articles/360013450280-Einf%C3%BChrungstutorial-Transactions'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 260,
    createdAt : '2019-01-28T18:27:52.014',
    updatedAt : '2019-01-28T18:27:52.014',
    __v : 0,
    helpUrl : 'https://getpayever.com/transactions/',
    installByDefault: false,
  },
  {
    _id : '6c969c34-e79b-4ec5-b11b-ff45aff397e4',
    type : 'settings',
    icon : '#icon-commerceos-settings',
    title : 'Settings',
    default : false,
    tutorial : {
      showOnTutorial : true,
      title : 'payever Settings',
      icon : '#icon-apps-settings',
      url : 'https://getpayever.com/help/settings/',
      urls : [ 
        {
          language : 'en',
          url : 'https://support.payever.org/hc/en-us/articles/360013519619-How-to-set-up-payever-Settings'
        }, 
        {
          language : 'de',
          url : 'https://support.payever.org/hc/de/articles/360013519619-Wie-richte-ich-payever-Setting-ein'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 0,
    createdAt : '2019-01-28T18:27:52.014',
    updatedAt : '2019-01-28T18:27:52.014',
    __v : 0,
    installByDefault: false,
  },
  {
    _id : '56a4545e-36c6-44a1-b381-90c67b89bbc2',
    type : 'marketing',
    icon : '#icon-commerceos-marketing',
    title : 'Marketing',
    default : false,
    tutorial : {
      showOnTutorial : true,
      title : 'payever Marketing',
      icon : '#icon-apps-marketing',
      url : 'https://getpayever.com/help/mail/',
      urls : [ 
        {
          language : 'en',
          url : 'https://support.payever.org/hc/en-us/articles/360023894714-How-to-setup-an-offer-via-mail'
        }, 
        {
          language : 'de',
          url : 'https://support.payever.org/hc/de/articles/360023894714-Wie-sende-ich-ein-Angebot-per-Mail'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 130,
    createdAt : '2019-01-28T18:27:52.014',
    updatedAt : '2019-01-28T18:27:52.014',
    __v : 0,
    helpUrl : 'https://getpayever.com/payevermail/',
    installByDefault: false,
  },
  {
    _id : '0b53fcef-11a6-45ed-8579-7603aee42a7b',
    type : 'checkout',
    icon : '#icon-commerceos-checkout',
    title : 'Checkout',
    default : false,
    tutorial : {
      showOnTutorial : true,
      title : 'payever Checkout',
      icon : '#icon-apps-payments',
      url : 'https://getpayever.com/help/checkout/',
      urls : [ 
        {
          language : 'en',
          url : 'https://support.payever.org/hc/en-us/articles/360023893874-How-to-setup-a-checkout'
        }, 
        {
          language : 'de',
          url : 'https://support.payever.org/hc/de/articles/360023893874-Checkout-erstellen'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 240,
    createdAt : '2019-01-28T18:27:52.014',
    updatedAt : '2019-01-28T18:27:52.014',
    __v : 0,
    helpUrl : 'https://getpayever.com/checkout/',
    installByDefault: false,
  },
  {
    _id : '38a8aa9c-784c-4c4e-a603-7da71a446af3',
    type : 'shop',
    icon : '#icon-commerceos-shop',
    title : 'Shop',
    default : false,
    tutorial : {
      showOnTutorial : true,
      title : 'payever Shop',
      icon : '#icon-apps-store',
      url : 'https://getpayever.com/help/shop/',
      urls : [ 
        {
          language : 'en',
          url : 'https://support.payever.org/hc/en-us/articles/360023894674-How-to-setup-a-shop'
        }, 
        {
          language : 'de',
          url : 'https://support.payever.org/hc/de/articles/360023894674-Wie-richte-ich-einen-Shop-ein-'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 210,
    createdAt : '2019-01-28T18:27:52.014',
    updatedAt : '2019-01-28T18:27:52.014',
    __v : 0,
    helpUrl : 'https://getpayever.com/shop/',
    installByDefault: false,
  },
  {
    _id : 'c2971ecb-4da2-4adc-8268-d458e25dfdfc',
    type : 'ads',
    icon : '#icon-commerceos-ads',
    title : 'Advertising',
    default : false,
    tutorial : {
      showOnTutorial : true,
      title : 'Payever Advertising',
      icon : '#icon-apps-ads',
      urls : [],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 140,
    createdAt : '2019-12-03T08:52:39.742',
    updatedAt : '2019-12-03T08:52:39.742',
    __v : 0,
    installByDefault: false,
  },
  {
    _id : '0b923041-e8f1-4531-9430-d2d593043e29',
    createdAt : '2021-06-29T07:12:59.612',
    default : false,
    icon : '#icon-commerceos-message',
    order : 180,
    title : 'Message',
    tutorial : {
      icon : '',
      title : 'Message',
      url : 'default',
      urls : [ 
        {
          language : 'en',
          url : 'https://getpayever.com/message/'
        }, 
        {
          language : 'de',
          url : 'https://getpayever.com/message/'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    type : 'message',
    updatedAt : '2021-06-29T07:12:59.612',
    installByDefault: false,
  },
  {
    _id : '93460865-c128-4e44-bceb-64316a4bd05c',
    createdAt : '2021-06-29T07:12:59.612',
    default : false,
    icon : '#icon-commerceos-shipping',
    order : 170,
    title : 'Shipping',
    tutorial : {
      icon : '',
      title : 'Shipping',
      url : 'default',
      urls : [ 
        {
          language : 'en',
          url : 'https://getpayever.com/shipping/'
        }, 
        {
          language : 'de',
          url : 'https://getpayever.com/shipping/'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    type : 'shipping',
    updatedAt : '2021-06-29T07:12:59.612',
    installByDefault: false,
  },
  {
    _id : 'ec1918b2-2945-4db9-8ff1-851a47d744b1',
    __v : 0,
    createdAt : '2021-03-30T10:09:02.407',
    default : false,
    icon : '#icon-commerceos-site',
    order : 190,
    title : 'Sites',
    tutorial : {
      icon : '',
      title : 'Sites',
      url : 'default',
      urls : [ 
        {
          language : 'en',
          url : 'https://getpayever.com/site/'
        }, 
        {
          language : 'de',
          url : 'https://getpayever.com/site/'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    type : 'site',
    updatedAt : '2021-03-30T10:09:02.407',
    installByDefault: false,
  },
  {
    _id : 'ad3cbe14-cd11-4bba-8a0a-39046ab2f7c0',
    type : 'contacts',
    icon : '#icon-commerceos-customers',
    title : 'Contacts',
    default : false,
    tutorial : {
      showOnTutorial : true,
      title : 'payever Contacts',
      icon : '#icon-apps-customers',
      urls : [ 
        {
          language : 'en',
          url : 'https://support.payever.org/hc/en-us/articles/360013519259-How-to-add-contacts'
        }, 
        {
          language : 'de',
          url : 'https://support.payever.org/hc/de/articles/360013519259-Wie-f%C3%BCge-ich-Kontakte-hinzu'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    order : 180,
    createdAt : '2019-01-28T18:27:52.014',
    updatedAt : '2019-01-28T18:27:52.014',
    __v : 0,
    helpUrl : 'https://getpayever.com/contacts-app/',
    installByDefault: false,
  },
  {
    _id : '5984444f-309f-4b53-9612-a51158b3acef',
    createdAt : '2021-06-29T07:12:59.612',
    default : false,
    icon : '#icon-commerceos-coupons',
    order : 150,
    title : 'Coupons',
    tutorial : {
      icon : '',
      title : 'Coupons',
      url : 'default',
      urls : [ 
        {
          language : 'en',
          url : 'https://getpayever.com/coupons/'
        }, 
        {
          language : 'de',
          url : 'https://getpayever.com/coupons/'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    type : 'coupons',
    updatedAt : '2021-06-29T07:12:59.612',
    installByDefault: false,
  },
  {
    _id : '13460865-c128-4e44-bceb-64316a4bd05b',
    createdAt : '2021-12-06T07:12:59.612',
    default : false,
    icon : '#icon-commerceos-blog',
    order : 170,
    title : 'Blog',
    tutorial : {
      icon : '',
      title : 'Blog',
      url : 'default',
      urls : [ 
        {
          language : 'en',
          url : 'https://getpayever.com/blog/'
        }, 
        {
          language : 'de',
          url : 'https://getpayever.com/blog/'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    type : 'blog',
    updatedAt : '2021-12-06T07:12:59.612',
    installByDefault: false,
  },
  {
    _id : '23460865-c128-4e44-bceb-64316a4bd05e',
    createdAt : '2021-12-06T07:12:59.612',
    default : false,
    icon : '#icon-commerceos-invoice',
    order : 170,
    title : 'Invoice',
    tutorial : {
      icon : '',
      title : 'Invoice',
      url : 'default',
      urls : [ 
        {
          language : 'en',
          url : 'https://getpayever.com/invoice/'
        }, 
        {
          language : 'de',
          url : 'https://getpayever.com/invoice/'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    type : 'invoice',
    updatedAt : '2021-12-06T07:12:59.612',
    installByDefault: false,
  },
  {
    _id : '33460865-c128-4e44-bceb-64316a4bd05a',
    createdAt : '2021-12-06T07:12:59.612',
    default : false,
    icon : '#icon-commerceos-appointments',
    order : 170,
    title : 'Appointments',
    tutorial : {
      icon : '',
      title : 'Appointments',
      url : 'default',
      urls : [ 
        {
          language : 'en',
          url : 'https://getpayever.com/appointments/'
        }, 
        {
          language : 'de',
          url : 'https://getpayever.com/appointments/'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    type : 'appointments',
    updatedAt : '2021-12-06T07:12:59.612',
    installByDefault: false,
  },
    {
    _id : '43460865-c128-4e44-bceb-64316a4bd05d',
    createdAt : '2021-12-06T07:12:59.612',
    default : false,
    icon : '#icon-commerceos-social',
    order : 170,
    title : 'Social',
    tutorial : {
      icon : '',
      title : 'Social',
      url : 'default',
      urls : [ 
        {
          language : 'en',
          url : 'https://getpayever.com/social/'
        }, 
        {
          language : 'de',
          url : 'https://getpayever.com/social/'
        }
      ],
      image : 'https://payevertesting.blob.core.windows.net/cdn/images/commerceos-tutorial-widget-background.png'
    },
    type : 'social',
    updatedAt : '2021-12-06T07:12:59.612',
    installByDefault: false,
  },
];
