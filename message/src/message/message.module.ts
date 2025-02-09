// tslint:disable: object-literal-sort-keys
import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  RedisModule,
  JwtAuthModule,
  RedisClient,
} from '@pe/nest-kit';
import {
  ChannelsModule,
} from '@pe/channels-sdk';

import { FoldersPluginModule } from '@pe/folders-plugin';
import { RulesSdkModule } from '@pe/rules-sdk';

import { FoldersConfig, RulesOptions } from './config';
import {
  BuilderExportCommand,
  MessageCacheCommand,
  RemoveMessagesWithoutChatCommand,
  SyncLastMessagesCommand,
  SyncTemplatesCommand,
  WidgetDataExportCommand,
  SyncMembersCommand,
} from './commands';
import {
  Profile,
  ProfileSchema,
} from './schemas';
import {
  MessageChannelSetsService,
  PermissionsService,
  ProfileService,
  RpcService,
  SocketIoEmitterService,
  MemberSyncService,
  MailMessageService,
} from './services';
import { AppChannelsModule } from './submodules/messaging/app-channels';
import { CommonChannelsModule } from './submodules/messaging/common-channels';
import { DirectChatsModule } from './submodules/messaging/direct-chat';
import { GroupChatsModule } from './submodules/messaging/group-chats';
import { CustomerChatsModule } from './submodules/messaging/customer-chat';
import { SupportChannelsModule } from './submodules/messaging/support-channels';
import {
  AdminRoleVoter,
  BecomeMemberVoter,
  DeleteMessageVoter,
  EditMessageVoter,
  ManageContactsVoter,
  CreateMessagingVoter,
  DeleteMessagingVoter,
  PinUnpinMessageVoter,
  MarkMessageReadVoter,
  CustomerChatCreateMessageVoter,
  ChangePermissionsVoter,
} from './voters';
import {
  PlatformModule,
  AbstractChatMessage,
  AbstractChatMessageSchema,
  ChatMember,
  ChatMemberSchema,
} from './submodules/platform';
import { InvitesModule } from './submodules/invites';
import { DraftMessagesModule } from './submodules/draft-messages';
import { TemplatesModule } from './submodules/templates';
import { BlockedUsersModule } from './submodules/blocked-users';
import { SearchMessagesModule } from './submodules/search-messages';
import {
  BuilderProducer,
  MerchantChatServerProducer,
  ThirdPartyMessengerProducer,
  WidgetsDataProducer,
  FolderPluginEventsProducer,
  WsWidgetProducer,
  EventMessageProducer,
} from './producers';
import {
  MessageListener,
  ChatListener,
  ChatTemplateListener,
  ChatMessageTemplateListener,
  ContactsListener,
  MessageAppListener,
  UserListener,
} from './listeners';
import { ProjectionsModule } from '../projections/projections.module';


import { environment } from '../environments';
import { ElasticSearchModule } from '@pe/elastic-kit';
import { RMQEventsProducer } from './producers/rmq-events.producer';
import { RabbitChannelsEnum } from './enums';
import { MessageFoldersController } from './controllers';
import { EmployeeConsumer, MarketingConsumer, UserConsumer } from './consumers';
import { NATIVE_REDIS_CLIENT_INJECTION_TOKEN } from '../const';

@Module({
  controllers: [
    MessageFoldersController,
    EmployeeConsumer,
    MarketingConsumer,
    UserConsumer,
  ],
  exports: [
    MessageChannelSetsService,

    PermissionsService,
    ProfileService,
    RpcService,
    SocketIoEmitterService,
    MemberSyncService,
    MailMessageService,


    PlatformModule,
    AppChannelsModule,
    CommonChannelsModule,
    CustomerChatsModule,
    DirectChatsModule,
    GroupChatsModule,
    SupportChannelsModule,

    InvitesModule,
    DraftMessagesModule,
    TemplatesModule,
    BlockedUsersModule,
    SearchMessagesModule,
  ],
  imports: [
    HttpModule,
    ChannelsModule.forRoot({
      channelSetPerSubscription: 'one-to-one',
      channel: RabbitChannelsEnum.Message,
      microservice: 'message',
    }),
    ProjectionsModule,
    RedisModule.forRoot(environment.redis),
    ElasticSearchModule.forRoot({
      authPassword: environment.elastic.password,
      authUsername: environment.elastic.username,
      cloudId: environment.elastic.cloudId,
      host: environment.elastic.host,
    }),

    MongooseModule.forFeature([{
      name: AbstractChatMessage.name,
      schema: AbstractChatMessageSchema,
    }, {
      name: Profile.name,
      schema: ProfileSchema,
    }, {
      name: ChatMember.name,
      schema: ChatMemberSchema,
    },
    ]),

    FoldersPluginModule.forFeature(FoldersConfig),
    RulesSdkModule.forRoot(RulesOptions),
    //  jwt module required by rules in any subapp ws or consumer
    JwtAuthModule.forRoot(environment.jwtOptions),

    PlatformModule,

    AppChannelsModule,
    CommonChannelsModule,
    CustomerChatsModule,
    DirectChatsModule,
    GroupChatsModule,
    SupportChannelsModule,

    InvitesModule,
    DraftMessagesModule,
    TemplatesModule,
    BlockedUsersModule,
    SearchMessagesModule.forRoot({ }),
  ],
  providers: [
    // Commands
    BuilderExportCommand,
    MessageCacheCommand,
    RemoveMessagesWithoutChatCommand,
    SyncLastMessagesCommand,
    SyncTemplatesCommand,
    WidgetDataExportCommand,
    SyncMembersCommand,
    // Services
    MessageChannelSetsService,
    PermissionsService,
    ProfileService,
    RpcService,
    SocketIoEmitterService,
    MemberSyncService,
    MailMessageService,
    // Producers
    BuilderProducer,
    MerchantChatServerProducer,
    ThirdPartyMessengerProducer,
    FolderPluginEventsProducer,
    WidgetsDataProducer,
    RMQEventsProducer,
    WsWidgetProducer,
    EventMessageProducer,
    // Listeners
    ChatListener,
    ChatTemplateListener,
    ChatMessageTemplateListener,
    ContactsListener,
    MessageListener,
    MessageAppListener,
    UserListener,
    // Voters
    AdminRoleVoter,
    BecomeMemberVoter,
    ManageContactsVoter,
    CreateMessagingVoter,
    EditMessageVoter,
    DeleteMessageVoter,
    DeleteMessagingVoter,
    MarkMessageReadVoter,
    PinUnpinMessageVoter,
    CustomerChatCreateMessageVoter,
    ChangePermissionsVoter,
  ],
})
export class MessageModule { }
