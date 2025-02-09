import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { NotificationModel } from '../../src/notifications/models/notification.model';
import { NotificationFactory } from './factories';

class CancelNotificationFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<NotificationModel> = this.application.get('NotificationModel');

    await model.create(NotificationFactory.create({
      app: 'shop',
      entity: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      kind: 'business',
      message: 'some_test_message',
    }));
  }
}

export = CancelNotificationFixture;
