import { Injectable } from '@nestjs/common';
import { WsSubscriptionService } from './../ws-subscription.service';
import { UserAlbumModel } from '../../../studio/models';
import { RedisClient } from '@pe/nest-kit';

@Injectable()
export class WsAlbumSubscriptionService extends WsSubscriptionService {
  constructor(
    client: RedisClient,
  ) {
    super(client);
  }

  public async returnAlbum(key: string, album: UserAlbumModel, name: string): Promise<void> {
    for (const clientId of this.findClientForKey(key)) {
      await this.sendMessage(
        clientId,
        {
          data: {
            album: album,
          },
          id: key,
          name: name,
          result: true,
        },
      );
    }
  }

  public async returnAlbums(key: string, albums: UserAlbumModel[], name: string): Promise<void> {
    for (const clientId of this.findClientForKey(key)) {
      await this.sendMessage(
        clientId,
        {
          data: {
            albums: albums,
          },
          id: key,
          name: name,
          result: true,
        },
      );
    }
  }
}
