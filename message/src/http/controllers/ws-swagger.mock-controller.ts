/* eslint-disable max-classes-per-file */
import {
  Controller,
  Body,
  Head,
} from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';
import {
  ForwardMessageWsRequestDto,
  MessageCreateWsRequestDto,
  MessageDeleteWsRequestDto,
  MemberUpdateWsRequestDto,
  MessageUpdateWsRequestDto,
  CreateMessageScrollerDto,
  MessageListDeleteWsRequestDto,
} from '../../ws/dto';
import { WsIncomingMessageEventCodeEnum, WsOutgoingMessageEventCodeEnum } from '../../ws/enums';
import { WsGateway } from '../../ws/services';

type GateWayInterface<T extends WsGateway, K extends keyof T> = {
  [key in K]: (...args: any[]) => void;
};

@Controller(`ws/emit`)
@ApiTags('ws/emit')
export class WsSwaggerIncomingMockController
  implements GateWayInterface<WsGateway,
  keyof Omit<WsGateway, 'server' | 'afterInit' | 'handleConnection' | 'handleDisconnect'>> {
  public server: (...args: any[]) => void;
  public afterInit(...args: any[]): void { }
  public handleConnection(...args: any[]): void { }
  public handleDisconnect(...args: any[]): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientJoinBusinessRoom)
  public onJoinBusinessRoom(@Body() businessId: string): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientJoinChatRoom)
  public onJoinChatRoom(@Body() chatId: string): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientLeaveChatRoom)
  public onLeaveChatRoom(@Body() chatId: string): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientExcludeMemberFromChat)
  public onExcludeMemberFromChat(@Body() chatId: string): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientLeaveMemberFromChat)
  public onLeaveMemberFromChat(@Body() chatId: string): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientMarkMessageRead)
  public onMarkMessageRead(@Body() chatId: string): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientMarkListMessageRead)
  public onMarkListMessageRead(@Body() chatId: string): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientPinMessage)
  public onPinMessage(messageId: string): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientUnpinMessage)
  public onUnpinMessage(messageId: string): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientForwardMessage)
  public onForwardMessages(@Body() dto: ForwardMessageWsRequestDto): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientSendMessage)
  public onPostMessage(@Body() dto: MessageCreateWsRequestDto): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientUpdateMessage)
  public onUpdateMessage(@Body() dto: MessageUpdateWsRequestDto): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientDeleteMessage)
  public onDeleteMessage(@Body() dto: MessageDeleteWsRequestDto): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientDeleteListMessage)
  public onDeleteListMessage(@Body() dto: MessageListDeleteWsRequestDto): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientUpdateMember)
  public onMemberUpdated(@Body() dto: MemberUpdateWsRequestDto): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientScrollRequest)
  public onScrollerScrolled(@Body() data: CreateMessageScrollerDto): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientChatTyping)
  public onTyping(...args: any[]): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientChatTypingStopped)
  public onTypingStopped(...args: any[]): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientChatSummaryRequest)
  public onChatSummaryRequest(...args: any[]): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientChatUnreadMessagesCountRequest)
  public onUnreadMessagesCountRequest(...args: any[]): void { }

  @Head(WsIncomingMessageEventCodeEnum.WsClientMarkMessageUnread)
  public onMarkMessageUnread(...args: any[]): void { }
}

@Controller(`ws/business-room/on`)
@ApiTags('ws/business-room/on')
export class WsSwaggerOutgoingToBusinessRoomMockController {
  @Head(WsOutgoingMessageEventCodeEnum.WsClientChatCreated)
  public onChatCreated(): void { }
  @Head(WsOutgoingMessageEventCodeEnum.WsClientChatDeleted)
  public onChatDeleted(): void { }
  @Head(WsOutgoingMessageEventCodeEnum.WsClientChatUpdated)
  public onChatUpdated(): void { }
  @Head(WsOutgoingMessageEventCodeEnum.WsClientContactCreated)
  public onContactCreated(): void { }
  @Head(WsOutgoingMessageEventCodeEnum.WsClientContactUpdated)
  public onContactUpdated(): void { }
  @Head(WsOutgoingMessageEventCodeEnum.WsClientScrollResponse)
  public onScrollResponse(): void { }
}

@Controller(`ws/chat-room/on`)
@ApiTags('ws/chat-room/on')
export class WsSwaggerOutgoingToChatRoomMockController {
  @Head(WsOutgoingMessageEventCodeEnum.WsClientMemberJoinedRoom)
  public onMemberJoinedRoom(): void { }
  @Head(WsOutgoingMessageEventCodeEnum.WsClientMemberLeftRoom)
  public onMemberLeftRoom(): void { }
  @Head(WsOutgoingMessageEventCodeEnum.WsClientMessagePosted)
  public onMessagePosted(): void { }
  @Head(WsOutgoingMessageEventCodeEnum.WsClientMessageUpdated)
  public onMessageUpdated(): void { }
  @Head(WsOutgoingMessageEventCodeEnum.WsClientListMessageUpdated)
  public onListMessageUpdated(): void { }
  @Head(WsOutgoingMessageEventCodeEnum.WsClientMessageDeleted)
  public onMessageDeleted(): void { }
  @Head(WsOutgoingMessageEventCodeEnum.WsClientMessageWithdrawed)
  public onMessageWithdrawed(): void { }
}
