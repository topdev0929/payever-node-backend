import { Injectable, Logger } from '@nestjs/common';
import { MediaChangedDto, MediaContainersEnum, MediaEventsEnum as MediaEvent } from '@pe/media-sdk';
import { Command, EventDispatcher } from '@pe/nest-kit';
import { BlogModel } from '../blog/models';
import { BlogService } from '../blog/services';

@Injectable()
export class CheckAssignedImagesCommand {
  constructor(
    private readonly blogService: BlogService,
    private readonly dispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'media:check-assigned',
    describe: 'Sends media is assigned message',
  })
  public async checkAssignedMedia(): Promise<void> {
    const limit: number = 100;

    let processedCount: number = 0;
    let skip: number = 0;
    while (true) {
      const blogs: BlogModel[] = await this.blogService.getList({ }, limit, skip);

      if (!blogs.length) {
        break;
      }

      processedCount += blogs.length;

      for (const blog of blogs) {
        await this.sendMediaAssignedMessage(blog);
      }

      skip += limit;
    }

    this.logger.log(processedCount + ' blogs were processed');
  }

  private async sendMediaAssignedMessage(blog: BlogModel): Promise<void> {
    if (blog.name && blog.business) {
      const list: string[] = [blog.name];

      const mediaChangedDto: MediaChangedDto = {
        container: MediaContainersEnum.Images,
        relatedEntity: {
          id: blog.id,
          type: 'BlogModel',
        },

        originalMediaCollection: [],
        updatedMediaCollection: list,
      };

      await this.dispatcher.dispatch(MediaEvent.MediaChanged, mediaChangedDto);
    }
  }
}
