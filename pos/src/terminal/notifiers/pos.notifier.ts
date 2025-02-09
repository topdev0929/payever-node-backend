import { Injectable } from '@nestjs/common';
import { InjectNotificationsEmitter, NotificationsEmitter } from '@pe/notifications-sdk';
import { BusinessModel } from '../../business/models';
import { PosNotificationsEnum } from '../enums';
import { TerminalModel } from '../models';

@Injectable()
export class PosNotifier {
  constructor(
    @InjectNotificationsEmitter() private readonly notificationsEmitter: NotificationsEmitter,
  ) { }

  public async sendAddThemeNotification(pos: TerminalModel, business: BusinessModel): Promise<void> {
    await this.sendNotification(PosNotificationsEnum.AddTheme, pos, business);
  }

  public async sendChooseProductsNotification(pos: TerminalModel, business: BusinessModel): Promise<void> {
    await this.sendNotification(PosNotificationsEnum.ChooseProducts, pos, business);
  }

  public async sendSelectBillingNotification(pos: TerminalModel, business: BusinessModel): Promise<void> {
    await this.sendNotification(PosNotificationsEnum.SelectBilling, pos, business);
  }

  public async sendTakeTourNotification(pos: TerminalModel, business: BusinessModel): Promise<void> {
    await this.sendNotification(PosNotificationsEnum.TakeTour, pos, business);
  }

  public async sendAddLogoNotification(pos: TerminalModel, business: BusinessModel): Promise<void> {
    await this.sendNotification(PosNotificationsEnum.AddLogo, pos, business);
  }

  public async cancelAddLogoNotification(pos: TerminalModel, business: BusinessModel): Promise<void> {
    await this.cancelNotification(PosNotificationsEnum.AddLogo, pos, business);
  }

  private async sendNotification(
    message: PosNotificationsEnum,
    pos: TerminalModel,
    business: BusinessModel,
  ): Promise<void> {
    await this.notificationsEmitter.sendNotification(
      {
        app: 'pos',
        entity: business.id,
        kind: 'business',
      },
      message,
      {
        channelSetId: pos.channelSet.id,
        shopId: pos.id,
      },
    );
  }

  private async cancelNotification(
    message: PosNotificationsEnum,
    pos: TerminalModel,
    business: BusinessModel,
  ): Promise<void> {
    await this.notificationsEmitter.cancelNotification(
      {
        app: 'pos',
        entity: business.id,
        kind: 'business',
      },
      message,
      {
        shopId: pos.id,
      },
    );
  }
}
