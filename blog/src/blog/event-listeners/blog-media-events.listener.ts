import { Injectable } from '@nestjs/common';
import { MediaChangedDto, MediaContainersEnum, MediaEventsEnum as MediaEvent } from '@pe/media-sdk';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { BlogEventsEnum } from '../enums';
import { BlogModel } from '../models';

@Injectable()
export class BlogMediaEventsListener {
  constructor(
    private readonly dispatcher: EventDispatcher,
  ) { }

  @EventListener(BlogEventsEnum.BlogCreated)
  public async onBlogCreated(blog: BlogModel): Promise<void> {
    if (blog.name) {
      await blog.populate('business').execPopulate();
      await this.triggerMediaChangedEvent([], [blog.name], blog.id);
    }
  }

  @EventListener(BlogEventsEnum.BlogUpdated)
  public async onBlogUpdated(originalBlog: BlogModel, updatedBlog: BlogModel): Promise<void> {
    const originalMedia: string[] = originalBlog.name ? [originalBlog.name] : [];
    const updatedMedia: string[] = updatedBlog.name ? [updatedBlog.name] : [];
    await updatedBlog.populate('business').execPopulate();

    await this.triggerMediaChangedEvent(originalMedia, updatedMedia, updatedBlog.id);
  }

  @EventListener(BlogEventsEnum.BlogRemoved)
  public async onBlogRemoved(blog: BlogModel): Promise<void> {
    if (blog.name) {
      await blog.populate('business').execPopulate();
      await this.triggerMediaChangedEvent([blog.name], [], blog.id);
    }
  }

  private async triggerMediaChangedEvent(
    originalMedia: string[],
    updatedMedia: string[],
    blogId: string,
  ): Promise<void> {
    const mediaChangedDto: MediaChangedDto = {
      container: MediaContainersEnum.Images,
      relatedEntity: {
        id: blogId,
        type: 'BlogModel',
      },

      originalMediaCollection: originalMedia,
      updatedMediaCollection: updatedMedia,
    };

    await this.dispatcher.dispatch(MediaEvent.MediaChanged, mediaChangedDto);
  }
}
