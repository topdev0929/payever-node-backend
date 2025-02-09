// tslint:disable: no-commented-code
import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AbstractController, RedisClient } from '@pe/nest-kit';
import { DecodedUserTokenInterface, SocketWithToken } from './interfaces';
import { WsOutgoingEventCodeEnum } from './enums';
// import { EventsGateway } from './events.gateway';
import { UserModel, UserService } from '../user';

@Injectable()
export class EventsService extends AbstractController {
  private readonly clientsByIdMap: Map<string, SocketWithToken> = new Map();

  constructor(
    private readonly logger: Logger,
    private readonly jwt: JwtService,
    // private readonly eventsGateway: EventsGateway,
    private readonly redisClient: RedisClient,
    private readonly userService: UserService,
  ) {
    super();
  }

  public async handleConnectionEvent(
    clientSocket: SocketWithToken,
  ): Promise<void> {
    this.logger.log(`Client connected "${clientSocket.id}"`, 'Merchantchat');
    const token: string = clientSocket.handshake.query.token;
    try {
      const decoded: DecodedUserTokenInterface = await this.jwt.verifyAsync(token);
      const user: UserModel = await this.userService.findOneById(decoded.user.id);
      if (!user) {
        throw new NotFoundException(`User with _id "${decoded.user.id}" not found.`);
      }
      const redisToken: string = await this.redisClient.get(decoded.user.tokenId);

      clientSocket.token = token;
      clientSocket.decodedToken = redisToken ? { user: JSON.parse(redisToken) } : decoded;
      clientSocket.emit('authenticated', user);
      this.clientsByIdMap.set(decoded.user.id, clientSocket);

      this.logger.log(`Client authenticated "${clientSocket.id}"`, 'Merchantchat');
    } catch (e) {
      clientSocket.emit('unauthorized', {
        data: e,
      });
      clientSocket.disconnect();
      this.logger.log(`Client unauthorized "${clientSocket.id}"`, 'Merchantchat');
    }
  }

  public async handleDisconnectEvent(
    clientSocket: SocketWithToken,
  ): Promise<void> {
    this.logger.log(`Client disconnected "${clientSocket.id}"`, 'Merchantchat');

    if (clientSocket.decodedToken?.user?.id) {
      this.clientsByIdMap.delete(clientSocket.decodedToken.user.id);
    }
  }

  public async joinMemberToBusinessRoom(
    clientSocket: SocketWithToken,
    businessId: string,
  ): Promise<void> {

    clientSocket.businessId = businessId;
    this.clientsByIdMap.set(clientSocket.decodedToken.user.id, clientSocket);

    const room: string = `service:business:${businessId}`;
    clientSocket.join(room);
    clientSocket.emit(WsOutgoingEventCodeEnum.WsClientMemberJoinedRoom, room);
  }
}
