import { Injectable } from '@nestjs/common';
import { BusinessAppInstallationModel, BusinessModel } from '../../user/models';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '../../user/enums';
import { BusinessLegalDocumentsNotifier } from '../notifiers';

@Injectable()
export class BusinessInformationRequestedListener {
  constructor(
    private readonly notifier: BusinessLegalDocumentsNotifier,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessInformationRequested)
  public async onBusinessInformationRequested(
    business: BusinessModel,
    installations: BusinessAppInstallationModel[],
  ): Promise<void> {
    await this.notifier.notifyToReviewLegalDocuments(business, installations);
  }
}
