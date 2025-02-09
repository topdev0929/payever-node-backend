import { fixture } from '@pe/cucumber-sdk';

import { WidgetModel } from '../../../src/widget';
import { widgetFactory } from '../factories/widget.factory';

export = fixture<WidgetModel>('WidgetModel', widgetFactory, [
  {
    _id: '25e394f9-a596-4410-9403-4d111420b1c8',
    title: 'Widget 1',
  },
  {
    _id: '358ada94-6559-4f92-9cdc-077ea46bc3d7',
    type: 'Widget 2',
  },
  {
    _id: 'e62b4849-b946-49ce-b863-7bcb7e8b978b',
    type: 'Widget 3',
  },
]);
