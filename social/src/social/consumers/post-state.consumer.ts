import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../common';
import { PostStateDto } from '../dtos';
import { RmqEventsEnum } from '../enums';
import { PostModel } from '../models';
import { PostsService } from '../services';


@Controller()
export class PostStateConsumer {
  constructor(
    private readonly postsService: PostsService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Social,
    name: RmqEventsEnum.postUpdate,
  })
  public async onPostStateUpdate(payload: PostStateDto): Promise<void> {
    this.logger.log({
      context: 'PostStateConsumer',
      message: `Received state update event for post: ${payload.postId}`,
      payload,
    });

    const post: PostModel = await this.postsService.getOneById(payload.postId);

    if (!post) {
      return;
    }

    await this.postsService.updatePostState(post, payload);
  }
}
