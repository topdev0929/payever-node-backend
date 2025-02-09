import { fixture } from '@pe/cucumber-sdk';

import { WidgetModel } from '../../../src/widget';
import { widgetFactory } from '../factories/widget.factory';

export = fixture<WidgetModel>('WidgetModel', widgetFactory, [
  {
    _id: '25e394f9-a596-4410-9403-4d111420b1c8',
    default: false,
    helpURL: `https://some-widget.test/help`,
    icon: 'some-icon',
    order: 1,
    title: `Some widget 1`,
    tutorial: {
      icon: 'some-icon',
      title: 'Some widget tutorial',
      url: `https://some-widget.test/tutorial`,
    },
    type: `widget-type-1`,
  },
]);
