import { Injectable } from '@nestjs/common';
import { MediaChangedDto, MediaContainersEnum, MediaEventsEnum } from '@pe/media-sdk';
import { BusinessEventsEnum } from '../enums';
import { BusinessModel, BusinessModelName } from '../models';
import { EventDispatcher, EventListener } from '@pe/nest-kit';

@Injectable()
export class BusinessMediaChangedListener {
  constructor(
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async handleBusinessCreated(business: BusinessModel): Promise<void> {

    const { imagesMedia, miscellaneousMedia }: any = BusinessMediaChangedListener.getBusinessMedia(business);

    if (imagesMedia.length) {
      await this.triggerMediaChangedEvent([], imagesMedia, business.id, MediaContainersEnum.Images);
    }

    if (miscellaneousMedia.length) {
      await this.triggerMediaChangedEvent(
        [],
        miscellaneousMedia,
        business.id,
        MediaContainersEnum.Miscellaneous,
      );
    }
  }

  @EventListener(BusinessEventsEnum.BusinessUpdated)
  public async handleBusinessUpdated(originalBusiness: BusinessModel, updatedBusiness: BusinessModel): Promise<void> {
    const originalBusinessMedia: {
      imagesMedia: string[];
      miscellaneousMedia: string[];
    } = BusinessMediaChangedListener.getBusinessMedia(originalBusiness);
    const updatedBusinessMedia: {
      imagesMedia: string[];
      miscellaneousMedia: string[];
    } = BusinessMediaChangedListener.getBusinessMedia(updatedBusiness);

    await this.triggerMediaChangedEvent(
      originalBusinessMedia.imagesMedia,
      updatedBusinessMedia.imagesMedia,
      updatedBusiness.id,
      MediaContainersEnum.Images,
    );
    await this.triggerMediaChangedEvent(
      originalBusinessMedia.miscellaneousMedia,
      updatedBusinessMedia.miscellaneousMedia,
      updatedBusiness.id,
      MediaContainersEnum.Miscellaneous,
    );
  }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    const { imagesMedia, miscellaneousMedia }: any = BusinessMediaChangedListener.getBusinessMedia(business);

    if (imagesMedia.length) {
      await  this.triggerMediaChangedEvent(imagesMedia, [], business.id, MediaContainersEnum.Images);
    }

    if (miscellaneousMedia.length) {
      await this.triggerMediaChangedEvent(
        miscellaneousMedia,
        [],
        business.id,
        MediaContainersEnum.Miscellaneous,
      );
    }
  }

  private static getBusinessMedia(
    business: BusinessModel,
  ): { imagesMedia: string[]; miscellaneousMedia: string[] } {
    const imagesMedia: string[] = [];
    const miscellaneousMedia: string[] = [];
    if (business.logo) {
      imagesMedia.push(business.logo);
    }

    if (business.documents && business.documents.commercialRegisterExcerptFilename) {
      miscellaneousMedia.push(business.documents.commercialRegisterExcerptFilename);
    }

    return { imagesMedia: imagesMedia, miscellaneousMedia: miscellaneousMedia };
  }

  private async triggerMediaChangedEvent(
    originalMedia: string[],
    newMedia: string[],
    businessId: string,
    container: MediaContainersEnum,
  ): Promise<void> {
    const mediaChangedDto: MediaChangedDto = {
      container: container,
      originalMediaCollection: originalMedia,
      relatedEntity: {
        id: businessId,
        type: BusinessModelName,
      },
      updatedMediaCollection: newMedia,
    };

    await this.eventDispatcher.dispatch(MediaEventsEnum.MediaChanged, mediaChangedDto);
  }
}
