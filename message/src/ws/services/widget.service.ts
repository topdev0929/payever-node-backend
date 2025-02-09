import { JwtService } from '@nestjs/jwt';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { RedisClient } from '@pe/nest-kit';
import { WsVoteCodes } from '../enums';
import { AbstractChatMessage, CommonMessagingService } from '../../message/submodules/platform';
import { BasicWsService } from './basic.ws-service';
import { CommonChannelHttpResponseDto } from '../../message/dto';
import {
  CommonChannelService,
  CommonChannel,
  CommonChannelDocument,
} from '../../message/submodules/messaging/common-channels';
import { commonChannelToResponseDto } from '../../message/transformers';
import { DecodedUserTokenInterface } from '../interfaces/decoded-token.interface';
import { WidgetWsGateway } from './widget.gateway';
import { SocketWithToken } from '../interfaces/ws-socket-local.interface';
import { ChatMessageStatusEnum } from '@pe/message-kit';

@Injectable()
export class WidgetWsService extends BasicWsService {

  constructor(
    logger: Logger,
    jwt: JwtService,
    widgetWsGateway: WidgetWsGateway,
    private readonly commonChannelService: CommonChannelService,
    private readonly commonMessagingService: CommonMessagingService,
    private readonly redisClient: RedisClient,
  ) {
    super(
      logger,
      jwt,
      widgetWsGateway,
    );
  }

  public async handleConnectionEvent(
    clientSocket: SocketWithToken,
  ): Promise<void> {

    const token: string = clientSocket.handshake.query.token;

    const decoded: DecodedUserTokenInterface = await this.jwt.verifyAsync(token);

    if (!decoded.user) {
      clientSocket.disconnect();
    }

    const redisToken: string = await this.redisClient.getClient().get(decoded.user.tokenId);

    clientSocket.decodedToken = redisToken ? { user: JSON.parse(redisToken) } : decoded;

    const businessId: string = clientSocket.handshake.query.businessId;
    if (!businessId) {
      throw new BadRequestException(`businessId required`);
    }
    const businessIntegrationChannels: CommonChannelDocument[] =
      await this.commonChannelService.findAndPopulate({
        business: businessId,
        deleted: { $ne: true },
        'permissions.live': true,
      }, 'pinned.messageId');

    const integrationChannels: CommonChannelDocument[] =
      await Promise.all(businessIntegrationChannels.map(async (chat: CommonChannelDocument) => {
        await this.denyAccessUnlessGranted(
          WsVoteCodes.JOIN_TO_ROOM,
          chat,
          { userToken: clientSocket.decodedToken.user },
          `Forbidden to join to integration-channel ${chat._id}`,
        );
        const roomId: string = this.commonMessagingService.getRoomIdByChatId(chat._id);
        clientSocket.join(roomId);
        
        return chat;
      }));

    const decryptedIntegrationChannels: CommonChannel[] = await Promise.all(
      integrationChannels.map(
        (channel: CommonChannelDocument) => this.commonMessagingService.decryptChat(channel),
      ),
    );

    const integrationChannelsDto: CommonChannelHttpResponseDto[] =
      decryptedIntegrationChannels.map((chat: CommonChannel) => {
        chat.lastMessages = chat.lastMessages
          ?.filter((message: AbstractChatMessage) => message.status !== ChatMessageStatusEnum.DELETED);

        return commonChannelToResponseDto(chat, {
          forUser: null,
        });
      });

    clientSocket.emit('authenticated', {
      integrationChannels: integrationChannelsDto,
    });
  }

  public async handleDisconnectEvent(
    clientSocket: SocketWithToken,
  ): Promise<void> {

  }
}
