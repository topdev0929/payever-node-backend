import { Injectable } from '@nestjs/common';
import { MediaChangedDto, MediaContainersEnum, MediaEventsEnum as MediaEvent } from '@pe/media-sdk';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { CheckoutEvent } from '../enums';
import { CheckoutModel } from '../models';

@Injectable()
export class CheckoutMediaEventsListener {
  constructor(
    private readonly dispatcher: EventDispatcher,
  ) { }

  @EventListener(CheckoutEvent.CheckoutCreated)
  public async handleCheckoutCreated(checkout: CheckoutModel): Promise<void> {
    if (checkout.logo) {
      await this.triggerMediaChangedEvent([], [checkout.logo], checkout.id);
    }
  }

  @EventListener(CheckoutEvent.CheckoutUpdated)
  public async handleCheckoutUpdated(
    originalCheckout: CheckoutModel,
    updatedCheckout: CheckoutModel,
  ): Promise<void> {
    const originalMedia: string[] = originalCheckout.logo ? [originalCheckout.logo] : [];
    const updatedMedia: string[] = updatedCheckout.logo ? [updatedCheckout.logo] : [];

    await this.triggerMediaChangedEvent(originalMedia, updatedMedia, updatedCheckout.id);
  }

  @EventListener(CheckoutEvent.CheckoutRemoved)
  public async handleCheckoutRemoved(checkout: CheckoutModel): Promise<void> {
    if (checkout.logo) {
      await this.triggerMediaChangedEvent([checkout.logo], [], checkout.id);
    }
  }

  private async triggerMediaChangedEvent(
    originalMedia: string[],
    updatedMedia: string[],
    checkoutId: string,
  ): Promise<void> {
    const dto: MediaChangedDto = {
      container: MediaContainersEnum.Images,
      originalMediaCollection: originalMedia,
      relatedEntity: {
        id: checkoutId,
        type: 'CheckoutModel',
      },
      updatedMediaCollection: updatedMedia,
    };
    await this.dispatcher.dispatch(MediaEvent.MediaChanged, dto);
  }
}
