import { fixture } from '@pe/cucumber-sdk';

import { PushNotificationModel, WidgetModel } from '../../../src/widget';
import { pushNotificationFactory } from '../factories/push-notification.factory';

export = fixture<PushNotificationModel>('PushNotificationModel', pushNotificationFactory, [
  {
    _id: '822ba24b-77da-4c7d-aed3-010b252f79b3',
    message: 'Message 1',
  },
  {
    _id: '2e037919-ca8f-4dc5-9a4f-f70070c4c8e5',
    message: 'Message 2',
  },
  {
    _id: '09d2afec-cda9-4110-888c-73d722a1988e',
    message: 'Message 3',
  },
]);
