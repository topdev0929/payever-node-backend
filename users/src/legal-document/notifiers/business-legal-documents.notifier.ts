import { Injectable } from '@nestjs/common';
import { BusinessAppInstallationModel, BusinessModel } from '../../user/models';
import { NotificationsEmitter } from '@pe/notifications-sdk';
import { BusinessLegalDocumentService } from '../services';
import { AppNameConverter } from '../converters';

@Injectable()
export class BusinessLegalDocumentsNotifier {
  
  constructor(
    private readonly notificationsEmitter: NotificationsEmitter,
    private readonly legalDocumentsService: BusinessLegalDocumentService,
  ) { }
  
  public async notifyToReviewLegalDocuments(
    business: BusinessModel,
    installations: BusinessAppInstallationModel[],
  ): Promise<void> {
    if (await this.legalDocumentsService.hasAnyDocument(business)) {
      return ;
    }

    for (const installation of installations) {
      await this.notificationsEmitter.sendNotification(
        {
          app: AppNameConverter.toNotificationsAppName(
            installation.code,
          ),
          entity: business.id,
          kind: 'business',
        },
        'notification.legalDocuments.review',
        { },
      );
    }
  }

  public async cancelReviewLegalDocumentsNotifications(
    business: BusinessModel,
    installations: BusinessAppInstallationModel[],
  ): Promise<void> {
    for (const installation of installations) {
      await this.notificationsEmitter.cancelNotification(
        {
          app: AppNameConverter.toNotificationsAppName(
            installation.code,
          ),
          entity: business.id,
          kind: 'business',
        },
        'notification.legalDocuments.review',
        { },
      );
    }
  }
}
