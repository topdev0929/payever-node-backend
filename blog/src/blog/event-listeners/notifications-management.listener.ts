import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BlogModel } from '../models';
import { BlogNotifier } from '../notifiers';
import { BusinessModel } from '../../business/models';
import { BlogEventsEnum } from '../enums';

@Injectable()
export class NotificationsManagementListener {
  constructor(
    private readonly notifier: BlogNotifier,
  ) { }

  @EventListener(BlogEventsEnum.BlogCreated)
  public async onBlogCreated(blog: BlogModel): Promise<void> {
    await blog.populate('business').execPopulate();
    const business: BusinessModel = blog.business;

    const messages: Array<Promise<void>> = [
      this.notifier.sendAddThemeNotification(blog, business),
      this.notifier.sendChooseProductsNotification(blog, business),
      this.notifier.sendSelectBillingNotification(blog, business),
      this.notifier.sendTakeTourNotification(blog, business),
    ];

    if (!blog.name) {
      messages.push(this.notifier.sendAddLogoNotification(blog, business));
    }

    await Promise.all(messages);
  }

  @EventListener(BlogEventsEnum.BlogUpdated)
  public async onBlogUpdated(originalBlog: BlogModel, updatedBlog: BlogModel): Promise<void> {
    await updatedBlog.populate('business').execPopulate();
  }
}
