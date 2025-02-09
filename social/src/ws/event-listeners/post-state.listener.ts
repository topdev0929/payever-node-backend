import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { PostModel } from '../../social';
import { PostStateEventsEnum } from '../../social/enums';
import { PostSubscriptionService } from '../services';

@Injectable()
export class PostStateListener {
  constructor(
    private readonly postSubscriptionService: PostSubscriptionService,
  ) { }

  @EventListener(PostStateEventsEnum.PostStateUpdated)
  public async onPostStateUpdated(post: PostModel): Promise<void> {
    await this.postSubscriptionService.sendPostState(post.postState, post._id);
  }
}
