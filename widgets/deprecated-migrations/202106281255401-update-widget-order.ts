const widgetCollection: string = 'widgets';

const appWidgets: any[] = [
  {
    _id: '0b923041-e8f1-4531-9430-d2d593043e29',
    createdAt: new Date(),
    default: false,
    icon: '#icon-message',
    installByDefault: true,
    order: 10,
    title: 'Message',
    tutorial: {
      icon: '',
      title: 'Message',
      url: 'default',
      urls: [
        { language: 'en', url: 'https://getpayever.com/message/'},
        { language: 'de', url: 'https://getpayever.com/message/'},
      ],

    },
    type: 'message',
    updatedAt: new Date(),
  },
  {
    _id: '93460865-c128-4e44-bceb-64316a4bd05c',
    createdAt: new Date(),
    default: true,
    icon: '#icon-shipping',
    installByDefault: true,
    order: 60,
    title: 'Shipping',
    tutorial: {
      icon: '',
      title: 'Shipping',
      url: 'default',
      urls: [
        { language: 'en', url: 'https://getpayever.com/shipping/'},
        { language: 'de', url: 'https://getpayever.com/shipping/'},
      ],

    },
    type: 'shippings',
    updatedAt: new Date(),
  },
  {
    _id: '5984444f-309f-4b53-9612-a51158b3acef',
    createdAt: new Date(),
    default: true,
    icon: '#icon-coupons',
    installByDefault: true,
    order: 80,
    title: 'Coupons',
    tutorial: {
      icon: '',
      title: 'Coupons',
      url: 'default',
      urls: [
        { language: 'en', url: 'https://getpayever.com/coupons/'},
        { language: 'de', url: 'https://getpayever.com/coupons/'},
      ],

    },
    type: 'coupons',
    updatedAt: new Date(),
  }];

async function UP(db: any): Promise<void> {
  for (const appWidget of appWidgets) {
    const existing: Array<{ }> = await db._find(widgetCollection, { type: appWidget.type });
    if (!existing.length) {
      await db.insert(widgetCollection, appWidget);
    }
  }
}

async function DOWN(db: any): Promise<any> {
  return null;
}

module.exports.up = UP;
module.exports.down = DOWN;

