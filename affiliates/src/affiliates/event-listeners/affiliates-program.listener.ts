import { Injectable } from '@nestjs/common';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { FoldersEventsEnum } from '@pe/folders-plugin';
import { AffiliatesMessagesProducer } from '../producers';
import { AffiliateProgramEventsEnum } from '../enums';
import { AffiliateProgramModel } from '../models';

@Injectable()
export class AffiliateProgramsListener {
  constructor(
    private readonly eventDispatcher: EventDispatcher,
    private readonly affiliatesMessagesProducer: AffiliatesMessagesProducer,
  ) { }

  @EventListener(AffiliateProgramEventsEnum.AffiliateProgramCreated)
  public async onAffiliateProgramCreated(affiliateProgram: AffiliateProgramModel, extraData: {
    parentFolderId: string;
    elasticIds: any;
  })
  : Promise<void>  {

    await this.eventDispatcher.dispatch(
      FoldersEventsEnum.FolderActionCreateDocument,
      { 
        ...affiliateProgram.toObject(), 
        businessId: affiliateProgram.business,
        elasticIds: extraData?.elasticIds,
        parentFolderId: extraData?.parentFolderId, 
      },
    );
    
    await this.affiliatesMessagesProducer.sendAffiliateProgramCreatedMessage(affiliateProgram);
  }


  @EventListener(AffiliateProgramEventsEnum.AffiliateProgramUpdated)
  public async onAffiliateProgramUpdated(affiliateProgram: AffiliateProgramModel, parentFolderId?: string)
  : Promise<void>  {
    if (parentFolderId) {
      await this.eventDispatcher.dispatch(
        FoldersEventsEnum.FolderActionUpdateDocument,
        { ...affiliateProgram.toObject(), businessId: affiliateProgram.business, parentFolderId: parentFolderId },
      );
    } else {
      await this.eventDispatcher.dispatch(
        FoldersEventsEnum.FolderActionUpdateDocument,
        { ...affiliateProgram.toObject(), businessId: affiliateProgram.business },
      );
    }
    await this.affiliatesMessagesProducer.sendAffiliateProgramUpdatedMessage(affiliateProgram);
  }


  @EventListener(AffiliateProgramEventsEnum.AffiliateProgramDeleted)
  public async onAffiliateProgramRemoved(affiliateProgram: AffiliateProgramModel): Promise<void>  {
    await this.eventDispatcher.dispatch(
      FoldersEventsEnum.FolderActionDeleteDocument,
      affiliateProgram._id,
    );
    await this.affiliatesMessagesProducer.sendAffiliateProgramRemovedMessage(affiliateProgram);
  }
}
