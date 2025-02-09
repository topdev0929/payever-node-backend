import { Injectable } from '@nestjs/common';
import { BusinessModel } from '../../models/business.model';
import { NotificationsEmitter } from '@pe/notifications-sdk';
import { InstalledApp } from '../../models/interfaces/installed-app';

@Injectable()
export class NotifierService {
  constructor(
    private readonly notificationsEmitter: NotificationsEmitter,
  ) { }

  public async notifyTakeTourBatch(business: BusinessModel, apps: InstalledApp[]): Promise<void> {
    for (const app of apps) {
      await this.notifyTakeTour(business, app.code);
    }
  }

  public async notifyTakeTour(business: BusinessModel, app: string): Promise<void> {
    const appCode: string = NotifierService.toNotificationsAppName(app);

    await this.notificationsEmitter.sendNotification(
      {
        app: appCode,
        entity: business.id,
        kind: 'business',
      },
      `notification.${appCode}.url.tour`,
      { },
    );
  }

  public async cancelTakeTourNotification(business: BusinessModel, app: string): Promise<void> {
    const appCode: string = NotifierService.toNotificationsAppName(app);

    await this.notificationsEmitter.cancelNotification(
      {
        app: appCode,
        entity: business.id,
        kind: 'business',
      },
      `notification.${appCode}.url.tour`,
      { },
    );
  }

  private static toNotificationsAppName(app: string): string {
    if (app === 'shop') {
      return 'shops';
    }

    return app;
  }
}
