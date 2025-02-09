import { Injectable } from '@nestjs/common';
import { UserOnlineStateDto } from '../dto/user-online-state.dto';
import { RedisClient } from '@pe/nest-kit';
import { USERS_ONLINE_STATES } from '../const/consts';


@Injectable()
export class UserOnlineStateService {
  constructor(private readonly redisClient: RedisClient) { }

  public async addOnlineUser(user: UserOnlineStateDto): Promise<void> {
    const states: UserOnlineStateDto[] = JSON.parse(
      (await this.redisClient.getClient().get(USERS_ONLINE_STATES)) ?? '[]'
    );
    if (!states.some((u) => u.userId === user.userId)) {
      states.push(user);
      await this.redisClient.getClient().set(USERS_ONLINE_STATES, JSON.stringify(states));
    }
  }

  public async removeOnlineUser(userId: string): Promise<UserOnlineStateDto[]> {
    let states: UserOnlineStateDto[] = JSON.parse(
      (await this.redisClient.getClient().get(USERS_ONLINE_STATES)) ?? '[]'
    );
    if (states.some((u) => u.userId === userId)) {
      states = states.filter((a) => a.userId !== userId);
      await this.redisClient.getClient().set(USERS_ONLINE_STATES, JSON.stringify(states));
    }

    return states;
  }

  public async getOnlineUsers(): Promise<UserOnlineStateDto[]> {
    return JSON.parse(
      (await this.redisClient.getClient().get(USERS_ONLINE_STATES)) ?? '[]'
    );
  }
}
