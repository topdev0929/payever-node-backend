import { Module, HttpModule } from '@nestjs/common';
import {
  ErrorsHandlerModule,
  TimeoutError,
} from '@pe/nest-kit';
import { MessageModule } from '../message/message.module';
import {
  PersonalChannelsController,
  ProxyMetaController,
  ChatTemplatesController,
  ChatMessageTemplatesController,
  SupportChannelController,
  AppChannelsController,
  BusinessChannelsController,
  CustomerChatsController,
  DirectChatsController,
  ChatInvitesController,
  ChatMessagesController,
  ContactsController,
  ConversationsController,
  GroupsController,
  IntegrationChannelsController,
  UsersController,
  SubscriptionsController,
  ChatDraftMessagesController,
  InvitationController,
  MessagingController,
  MembersController,
  ProfileController,
  SlugController,
  GuestController,
} from './controllers';
import {
  WsSwaggerIncomingMockController,
  WsSwaggerOutgoingToBusinessRoomMockController,
  WsSwaggerOutgoingToChatRoomMockController,
} from './controllers/ws-swagger.mock-controller';

import { ProjectionsModule } from '../projections/projections.module';
import { AuthClientService } from '../message/client';
import { IntegrationLinkModule } from '../message/submodules/integration-link/integration-link.module';

@Module({
  controllers: [
    // Admin
    ChatTemplatesController,
    ChatMessageTemplatesController,
    SupportChannelController,
    PersonalChannelsController,
    // Normal
    MessagingController,
    MembersController,
    InvitationController,
    AppChannelsController,

    BusinessChannelsController,
    SlugController,

    CustomerChatsController,
    DirectChatsController,
    GroupsController,
    IntegrationChannelsController,
    ConversationsController,
    
    GuestController,
    ChatInvitesController,
    ChatMessagesController,
    ChatDraftMessagesController,
    ContactsController,
    UsersController,
    ProfileController,
    SubscriptionsController,
    WsSwaggerIncomingMockController,
    WsSwaggerOutgoingToBusinessRoomMockController,
    WsSwaggerOutgoingToChatRoomMockController,
    ProxyMetaController,
  ],
  imports: [
    MessageModule,
    ProjectionsModule,
    HttpModule,
    IntegrationLinkModule,
    ErrorsHandlerModule.forRoot([
      {
        exceptions: [TimeoutError],
        name: 'rpc-timeout',
      },
    ]),
  ],
  providers: [
    AuthClientService,
  ],
})
export class MessagesHttpModule { }
