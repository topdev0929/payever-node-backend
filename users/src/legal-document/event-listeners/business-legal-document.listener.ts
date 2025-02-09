import { Injectable } from '@nestjs/common';
import { BusinessLegalDocumentModel } from '../models';
import { BusinessLegalDocumentsNotifier } from '../notifiers';
import { EventListener } from '@pe/nest-kit';
import { BusinessLegalDocumentEventsEnum } from '../enums';
import { BusinessAppInstallationService } from '../../user/services';
import { BusinessAppInstallationModel } from '../../user/models';

@Injectable()
export class BusinessLegalDocumentListener {
  constructor(
    private readonly notifier: BusinessLegalDocumentsNotifier,
    private readonly businessAppInstalationService: BusinessAppInstallationService,
  ) { }

  @EventListener(BusinessLegalDocumentEventsEnum.Updated)
  public async onBusinessLegalDocumentUpdated(document: BusinessLegalDocumentModel): Promise<void> {
    await document.populate('business').execPopulate();
    const installations: BusinessAppInstallationModel[] = await this.businessAppInstalationService.getListByBusinessId(
      document.business.id,
    );

    await this.notifier.cancelReviewLegalDocumentsNotifications(document.business, installations);
  }
}
