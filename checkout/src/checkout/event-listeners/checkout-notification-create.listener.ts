import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { NotificationsEmitter } from '@pe/notifications-sdk';
import * as assert from 'assert';
import { CheckoutEvent } from '../enums';
import { CheckoutModel } from '../models';

@Injectable()
export class CheckoutNotificationCreateListener {
  constructor(
    private readonly notificationsEmitter: NotificationsEmitter,
  ) { }

  @EventListener(CheckoutEvent.CheckoutCreated)
  public async onCheckoutCreated(checkout: CheckoutModel): Promise<void>  {
    await this.notificationsEmitter.sendNotification(
      {
        app: 'checkout',
        entity: checkout.businessId,
        kind: 'business',
      },
      'notification.checkout.settings.setStyles',
      {
        checkoutId: checkout.id,
      },
    );
  }

  @EventListener(CheckoutEvent.CheckoutUpdated)
  public async onCheckoutUpdated(originalCheckout: CheckoutModel, updatedCheckout: CheckoutModel): Promise<void>  {
    if (!this.isStyleUpdated(originalCheckout, updatedCheckout)) {
      return ;
    }

    await this.notificationsEmitter.cancelNotification(
      {
        app: 'checkout',
        entity: updatedCheckout.businessId,
        kind: 'business',
      },
      'notification.checkout.settings.setStyles',
      {
        checkoutId: updatedCheckout.id,
      },
    );
  }

  private isStyleUpdated(originalCheckout: CheckoutModel, updatedCheckout: CheckoutModel): boolean {
    if (!updatedCheckout.settings || !updatedCheckout.settings.styles) {
      return false;
    }

    if (!originalCheckout.settings || !originalCheckout.settings.styles) {
      return true;
    }

    try {
      assert.deepEqual(
        JSON.parse(JSON.stringify(originalCheckout.settings.styles)),
        JSON.parse(JSON.stringify(updatedCheckout.settings.styles)),
      );

      return false;
    } catch (e) {
      return true;
    }
  }
}
