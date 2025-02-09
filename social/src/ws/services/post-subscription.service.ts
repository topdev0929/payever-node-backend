import { Injectable } from '@nestjs/common';
import { PostStateInterface } from '../../social/interfaces/post-state.interface';
import { WsSubscriptionService } from './ws-subscription.service';
@Injectable()
export class PostSubscriptionService extends WsSubscriptionService {
  public async sendPostState(data: PostStateInterface[], postId: string): Promise<void> {
    for (const clientId of this.findClientForKey(postId)) {
      await this.sendMessage(
        clientId,
        {
          data: data,
          name: 'post.state',
          result: true,
        },
      );
    }
  }
}
