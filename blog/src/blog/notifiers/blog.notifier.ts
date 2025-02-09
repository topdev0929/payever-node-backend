import { Injectable } from '@nestjs/common';
import { InjectNotificationsEmitter, NotificationsEmitter } from '@pe/notifications-sdk';
import { BusinessModel } from '../../business/models';
import { BlogNotificationsEnum } from '../enums';
import { BlogModel } from '../models';

@Injectable()
export class BlogNotifier {
  constructor(
    @InjectNotificationsEmitter() private readonly notificationsEmitter: NotificationsEmitter,
  ) { }

  public async sendAddThemeNotification(blog: BlogModel, business: BusinessModel): Promise<void> {
    await this.sendNotification(BlogNotificationsEnum.AddTheme, blog, business);
  }

  public async sendChooseProductsNotification(blog: BlogModel, business: BusinessModel): Promise<void> {
    await this.sendNotification(BlogNotificationsEnum.ChooseProducts, blog, business);
  }

  public async sendSelectBillingNotification(blog: BlogModel, business: BusinessModel): Promise<void> {
    await this.sendNotification(BlogNotificationsEnum.SelectBilling, blog, business);
  }

  public async sendTakeTourNotification(blog: BlogModel, business: BusinessModel): Promise<void> {
    await this.sendNotification(BlogNotificationsEnum.TakeTour, blog, business);
  }

  public async sendAddLogoNotification(blog: BlogModel, business: BusinessModel): Promise<void> {
    await this.sendNotification(BlogNotificationsEnum.AddLogo, blog, business);
  }

  private async sendNotification(
    message: BlogNotificationsEnum,
    blog: BlogModel,
    business: BusinessModel,
  ): Promise<void> {
    await this.notificationsEmitter.sendNotification(
      {
        app: 'blog',
        entity: business.id,
        kind: 'business',
      },
      message,
      {
        blogId: blog.id,
        channelSetId: blog.channelSet.id,
      },
    );
  }

  private async cancelNotification(
    message: BlogNotificationsEnum,
    blog: BlogModel,
    business: BusinessModel,
  ): Promise<void> {
    await this.notificationsEmitter.cancelNotification(
      {
        app: 'blog',
        entity: business.id,
        kind: 'business',
      },
      message,
      {
        blogId: blog.id,
      },
    );
  }
}
