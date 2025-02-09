/* eslint-disable @typescript-eslint/unbound-method */
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { verify as jwtVerify, decode as jwtDecode } from 'jsonwebtoken';
import { plainToClass } from 'class-transformer';
import * as jsonpack from 'jsonpack';
import * as WebSocket from 'ws';
import { v4 as uuidV4 } from 'uuid';

import { AccessTokenPayload } from '@pe/nest-kit';
import { MessageNameEnum } from './enums/message-name.enum';
import {
  MessagePayloadInterface, MessageResponseInterface,
} from './interfaces';
import { environment } from '../environments';
import { PostsService } from '../social';
import { PostSubscriptionService } from './services';

@WebSocketGateway()
export class EventsGateway {

  public constructor(
    private readonly postService: PostsService,
    private readonly postSubscriptionService: PostSubscriptionService,
  ) { }

  @SubscribeMessage(MessageNameEnum.CONNECT)
  public async onConnectEvent(client: WebSocket, payload: MessagePayloadInterface): Promise<MessageResponseInterface> {
    if (!this.postSubscriptionService.verify(payload.token)) {

      return {
        name: MessageNameEnum.CONNECT,
        result: false,
      };
    }

    this.postSubscriptionService.saveClient(payload.postId, uuidV4(), client);

    this.closing(client);

    return {
      id: payload.id,
      name: MessageNameEnum.CONNECT,
      result: this.verifyToken(payload.token),
    };
  }

  @SubscribeMessage(MessageNameEnum.GET_BUSINESS_POST_STATUS)
  public async onBusinessWidgetsEvent(
    client: WebSocket,
    payload: MessagePayloadInterface,
  ): Promise<MessageResponseInterface> {
    const businessId: string = payload.id;

    const widgetsResponse: MessageResponseInterface = {
      id: businessId,
      name: MessageNameEnum.GET_BUSINESS_POST_STATUS,
      result: false,
    };

    if (!this.verifyToken(payload.token)) {
      return widgetsResponse;
    }

    widgetsResponse.data = await this.postService.getByBusinessAndId(businessId, payload.postId);
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  private verifyToken(token: string): boolean {
    try {
      jwtVerify(token, environment.jwtOptions.secret);
    } catch (e) {
      return false;
    }

    return true;
  }

  private extractDataFromToken(token: string): AccessTokenPayload {
    let jwtDecoded: any = jwtDecode(token);

    try {
      jwtDecoded = jsonpack.unpack(jwtDecoded);
    } catch (e) { }

    const userData: any = jwtDecoded ? jwtDecoded.user : null;

    return userData ? plainToClass(AccessTokenPayload, userData) : null;
  }

  private closing(client: WebSocket): void {
    client.removeListener('close', this.closing);
  }
}
