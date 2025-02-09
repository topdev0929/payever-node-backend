import {
  Inject,
  forwardRef,
  Logger,
  Injectable,
  UsePipes,
  ValidationPipe,
  ValidationError,
  UseFilters,
} from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ValidationPipeObject } from '@pe/nest-kit';
import { WsIncomingMessageEventCodeEnum } from '../enums/message-events.enum';
import { SocketWithToken } from '../interfaces/ws-socket-local.interface';
import { WsService } from './ws.service';
import {
  MessageCreateWsRequestDto,
  MessageDeleteWsRequestDto,
  MemberUpdateWsRequestDto,
  MessageUpdateWsRequestDto,
  ForwardMessageWsRequestDto,
  CreateMessageScrollerDto,
  ExcludeMemberDto,
  UnreadMessagesCountRequestDto,
  MessageListDeleteWsRequestDto,
} from '../dto';
import { ChatMessageWsResponseDto } from '../dto/outgoing';
import { PinMessageDto, UnpinMessageDto } from '../../message/dto';
import { SocketIoEmitterService } from '../../message';
import { WsExceptionsFilter } from '../filters';
import { OptionsBody } from '../decorators';
import { ReqIdPipe } from '../pipes';
import { WsClientTypingDto } from '../dto/ws-client-typing.dto';

@Injectable()
@UsePipes(ReqIdPipe, new ValidationPipe(ValidationPipeObject({
  exceptionFactory: (errors: ValidationError[]) => new WsException(errors),
})))
@UseFilters(new WsExceptionsFilter())
@WebSocketGateway({
  namespace: '/chat',
  path: '/ws/',
  transports: ['websocket'],
})
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  constructor(
    private logger: Logger,
    @Inject(forwardRef(() => WsService)) private wsService: WsService,
    private readonly socketIoEmitterService: SocketIoEmitterService,
  ) {
  }

  public async afterInit(server: Server): Promise<void> {
    this.logger.log(`Ws Init`);
    this.socketIoEmitterService.servers.chat = this.server;
    await this.wsService.initialOnlineCacheData();
  }

  public async handleConnection(socket: SocketWithToken, ...args: any[]): Promise<void> {
    try {
      this.socketIoEmitterService?.addSocket(socket);
      await this.wsService.handleConnectionEvent(socket);
    } catch (ex) {
      socket.emit('exception', ex.message);
      socket.disconnect();
    }
  }

  public async handleDisconnect(socket: SocketWithToken): Promise<void> {
    try {
      this.socketIoEmitterService.removeSocket(socket.id);
      await this.wsService.handleDisconnectEvent(socket);
    } catch (error) {
      this.logger.error({
        context: 'WsGateway.disonnect',
        error,
        message: `disconnect got an error`,
      });
    }
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientJoinBusinessRoom)
  public async onJoinBusinessRoom(
    @ConnectedSocket() clientSocket: SocketWithToken,
    @MessageBody() businessId: string,
    @OptionsBody() reqId: string,
  ): Promise<void> {
    await this.wsService.joinMemberToBusinessRoom(clientSocket, businessId, reqId);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientJoinChatRoom)
  public async onJoinChatRoom(
    clientSocket: SocketWithToken,
    chatIds: string | string[],
  ): Promise<void> {
    if (typeof chatIds === 'string') {
      chatIds = [chatIds];
    }
    await Promise.all(chatIds.map((chatId: string) => this.wsService.joinMemberToChatRoom(clientSocket, chatId)));
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientLeaveChatRoom)
  public async onLeaveChatRoom(
    clientSocket: SocketWithToken,
    chatId: string,
  ): Promise<void> {
    await this.wsService.leaveMemberFromChatRoom(clientSocket, chatId);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientLeaveMemberFromChat)
  public async onLeaveMemberFromChat(
    clientSocket: SocketWithToken,
    chatId: string,
  ): Promise<void> {
    await this.wsService.leaveMemberFromChat(clientSocket, chatId);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientExcludeMemberFromChat)
  public async onExcludeMemberFromChat(
    @MessageBody() data: ExcludeMemberDto,
    @ConnectedSocket() clientSocket: SocketWithToken,
  ): Promise<void> {
    await this.wsService.excludeMemberFromChat(clientSocket, data);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientMarkMessageRead)
  public async onMarkMessageRead(
    @ConnectedSocket() clientSocket: SocketWithToken,
    @MessageBody() messagesId: string | string[],
  ): Promise<void> {
    await this.wsService.handleMarkMessageRead(clientSocket, messagesId);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientMarkListMessageRead)
  public async onMarkListMessageRead(
    @ConnectedSocket() clientSocket: SocketWithToken,
    @MessageBody() messagesId: string[],
  ): Promise<void> {
    await this.wsService.handleMarkListMessageRead(clientSocket, messagesId);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientMarkMessageUnread)
  public async onMarkMessageUnread(
    @ConnectedSocket() clientSocket: SocketWithToken,
    @MessageBody() messageId: string,
  ): Promise<void> {
    await this.wsService.handleMarkMessageUnread(clientSocket, messageId);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientPinMessage)
  public async onPinMessage(
    @ConnectedSocket() clientSocket: SocketWithToken,
    @MessageBody() data: PinMessageDto,
  ): Promise<void> {
    await this.wsService.handlePinMessage(clientSocket, data);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientUnpinMessage)
  public async onUnpinMessage(
    @ConnectedSocket() clientSocket: SocketWithToken,
    @MessageBody() data: UnpinMessageDto,
  ): Promise<void> {
    await this.wsService.handleUnpinMessage(
      clientSocket,
      data,
    );
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientForwardMessage)
  public async onForwardMessages(
    @MessageBody() data: ForwardMessageWsRequestDto,
    @ConnectedSocket() clientSocket: SocketWithToken,
  ): Promise<ChatMessageWsResponseDto[]> {
    return this.wsService.handleForwardMessages(clientSocket, data);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientSendMessage)
  public async onPostMessage(
    @MessageBody() data: MessageCreateWsRequestDto,
    @ConnectedSocket() clientSocket: SocketWithToken,
  ): Promise<ChatMessageWsResponseDto> {
    return this.wsService.handleSendMessage(clientSocket, data);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientUpdateMessage)
  public async onUpdateMessage(
    @MessageBody() data: MessageUpdateWsRequestDto,
    @ConnectedSocket() clientSocket: SocketWithToken,
  ): Promise<void> {
    await this.wsService.handleUpdateMessage(clientSocket, data);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientDeleteMessage)
  public async onDeleteMessage(
    @MessageBody() data: MessageDeleteWsRequestDto,
    @ConnectedSocket() clientSocket: SocketWithToken,
  ): Promise<void> {
    await this.wsService.handleDeleteMessage(clientSocket, data);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientDeleteListMessage)
  public async onDeleteListMessage(
    @MessageBody() data: MessageListDeleteWsRequestDto,
    @ConnectedSocket() clientSocket: SocketWithToken,
  ): Promise<void> {
    await this.wsService.handleDeleteListMessage(clientSocket, data);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientUpdateMember)
  public async onMemberUpdated(
    @MessageBody() data: MemberUpdateWsRequestDto,
    @ConnectedSocket() clientSocket: SocketWithToken,
  ): Promise<void> {
    await this.wsService.handleUpdateMember(clientSocket, data);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientScrollRequest)
  public async onScrollerScrolled(
    @MessageBody() data: CreateMessageScrollerDto,
    @ConnectedSocket() clientSocket: SocketWithToken,
    @OptionsBody() reqId: string,
  ): Promise<void> {
    await this.wsService.scroll(clientSocket, data, reqId);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientChatTyping)
  public async onTyping(
    clientSocket: SocketWithToken,
    dto: WsClientTypingDto,
  ): Promise<void> {
    await this.wsService.handleMemberTyping(clientSocket, dto.chatId);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientChatTypingStopped)
  public async onTypingStopped(
    clientSocket: SocketWithToken,
    dto: WsClientTypingDto,
  ): Promise<void> {
    await this.wsService.handleMemberTypingStopped(clientSocket, dto.chatId);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientChatSummaryRequest)
  public async onChatSummaryRequest(
    @ConnectedSocket() clientSocket: SocketWithToken,
    @MessageBody() chatId: string,
    @OptionsBody() reqId: string,
  ): Promise<void> {
    await this.wsService.handleChatSummaryRequest(clientSocket, chatId, reqId);
  }

  @SubscribeMessage(WsIncomingMessageEventCodeEnum.WsClientChatUnreadMessagesCountRequest)
  public async onUnreadMessagesCountRequest(
    @MessageBody() dto: UnreadMessagesCountRequestDto,
    @ConnectedSocket() clientSocket: SocketWithToken,
    @OptionsBody() reqId: string,
  ): Promise<void> {
    await this.wsService.handleUnreadMessagesCountRequest(clientSocket, dto, reqId);
  }
}
