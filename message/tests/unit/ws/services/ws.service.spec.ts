import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AuthorizationCheckerService,
  RabbitMqClient,
  RedisClient,
} from '@pe/nest-kit';

import * as chai from 'chai';
import * as sinon from 'sinon';

import {
  CommonMessagingService,
  ChatMessageService,
  ChatTypingMembersService,
  ChatOnlineMembersService,
  MessagesRedisService,
} from '../../../../src/message/submodules/platform';
import { ForwardMessageWsRequestDto } from '../../../../src/ws/dto';
import {
  ProfileService,
  SocketIoEmitterService,
} from '../../../../src/message';
import { UsersService } from '../../../../src/projections';

import { WsService } from '../../../../src/ws/services/ws.service';
import { WsGateway } from '../../../../src/ws/services/ws.gateway';
import { StompService } from '@pe/stomp-client';
import { UserOnlineStateService } from '../../../../src/ws/services/user-online-state-service';


const expect: Chai.ExpectStatic = chai.expect;

const messagesGateway = sinon.createStubInstance(WsGateway);
const rabbitMqClient = sinon.createStubInstance(RabbitMqClient);
const commonMessagingServiceStub = sinon.createStubInstance(CommonMessagingService);
const chatMessageServiceStub = sinon.createStubInstance(ChatMessageService);
const chatTypingServiceStub = sinon.createStubInstance(ChatTypingMembersService);
const chatOnlineServiceStub = sinon.createStubInstance(ChatOnlineMembersService);
const usersServiceStub = sinon.createStubInstance(UsersService);
const redisClientStub = sinon.createStubInstance(RedisClient);
const profileServiceStub = sinon.createStubInstance(ProfileService);
const socketIoEmitterServiceStub = sinon.createStubInstance(SocketIoEmitterService);
const messageRedisServiceStub = sinon.createStubInstance(MessagesRedisService);
const stompServiceStub = sinon.createStubInstance(StompService);
const jwtServiceStub = sinon.createStubInstance(JwtService);
const userOnlineStateService = sinon.createStubInstance(UserOnlineStateService);

const authorizationCheckerStub = sinon.createStubInstance(
  AuthorizationCheckerService
);

describe('WsService', () => {
  let wsService: WsService;
  let sandbox: sinon.SinonSandbox;
  let chatMessageService: sinon.SinonStubbedInstance<ChatMessageService>;
  let commonMessagingService: sinon.SinonStubbedInstance<CommonMessagingService>;
  let authorizationChecker: sinon.SinonStubbedInstance<AuthorizationCheckerService>;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        WsService,
        {
          provide: AuthorizationCheckerService,
          useValue: authorizationCheckerStub,
        },
        {
          provide: JwtService,
          useValue: jwtServiceStub,
        },
        {
          provide: WsGateway,
          useValue: messagesGateway,
        },
        {
          provide: RabbitMqClient,
          useValue: rabbitMqClient,
        },
        {
          provide: CommonMessagingService,
          useValue: commonMessagingServiceStub,
        },
        {
          provide: ChatMessageService,
          useValue: chatMessageServiceStub,
        },
        {
          provide: ChatTypingMembersService,
          useValue: chatTypingServiceStub,
        },
        {
          provide: ChatOnlineMembersService,
          useValue: chatOnlineServiceStub,
        },
        {
          provide: UsersService,
          useValue: usersServiceStub,
        },
        {
          provide: RedisClient,
          useValue: redisClientStub,
        },
        {
          provide: ProfileService,
          useValue: profileServiceStub,
        },
        {
          provide: SocketIoEmitterService,
          useValue: socketIoEmitterServiceStub,
        },
        {
          provide: MessagesRedisService,
          useValue: messageRedisServiceStub,
        },
        {
          provide: StompService,
          useValue: stompServiceStub
        },
        {
          provide: UserOnlineStateService,
          useValue: userOnlineStateService
        }
      ],
    }).compile();

    wsService = module.get<WsService>(WsService);
    chatMessageService = module.get<ChatMessageService>(ChatMessageService) as any;
    commonMessagingService = module.get<CommonMessagingService>(CommonMessagingService) as any;
    authorizationChecker = module.get<AuthorizationCheckerService>(AuthorizationCheckerService) as any;
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
  });

  it('Should forward box type messages', async () => {

    const dto: ForwardMessageWsRequestDto = {
      chat: '9396a5fc-dfaa-455c-8a3f-25cbb2d426cb',
      ids: ['1da1a3cf-3f20-4e38-b23b-85f2c6fdac10'],
      withSender: true,
    };

    const originalSender = {
      _id: 'a7d2f7c6-4c45-48de-9de3-9f1c7f1d16bb',
      userAccount: {
        firstName: 'payever',
        lastName: 'payever',
      },
    };

    const originalMessaging = {
      _id: '9396a5fc-dfaa-455c-8a3f-25cbb2d426cb',
      salt: 'salt',
    };

    const originalMessage = {
      _id: 'fd5e5f68-1100-443d-9404-d998ef8fd305',
      deletedForUsers: [],
      status: 'sent',
      type: 'box',
      attachments: [],
      content: 'b7d9126de485ebc3f813130a30ab2667',
      interactive: {
        _id: 'f822048e-dc57-46cf-a8ee-2bc7732a50df',
        defaultLanguage: 'en',
        action: 'https://yandex.ru',
        marked: true,
        translations: {
          en: 'test',
        },
      },
      sentAt: {
        $date: '2021-06-14T13:38:45.261Z',
      },
      chat: 'bbd07634-5775-4301-a151-f1d2dc8f38be',
      editedAt: null,
      sender: originalSender._id,
      updatedAt: {
        $date: '2021-06-14T13:55:56.570Z',
      },
      components: [],
      createdAt: {
        $date: '2021-06-14T13:38:45.479Z',
      },
      __v: 0,
      toObject: () => originalMessage,
    };

    const clientSocket = {
      decodedToken: {
        user: {
          id: originalSender._id,
        },
      },
    }

    chatMessageService.findById.resolves(originalMessage as any);
    authorizationChecker.isGranted.resolves(true);
    commonMessagingService.findById.resolves(originalMessaging as any);

    const createForwardBoxMessageSpy = sandbox.spy(wsService as any, 'createForwardBoxMessage');
    const createForwardTextMessageSpy = sandbox.spy(wsService as any, 'createForwardTextMessage');
    chatMessageService.create.resolves([originalMessage as any]);

    await wsService.handleForwardMessages(
      clientSocket as any,
      dto,
    );

    expect(createForwardBoxMessageSpy.called).to.be.equal(true);
    expect(createForwardTextMessageSpy.called).to.be.equal(false);
    expect(chatMessageService.create.called).to.be.equal(true);
  });

  it('Should forward text type messages', async () => {

    const dto: ForwardMessageWsRequestDto = {
      chat: '9396a5fc-dfaa-455c-8a3f-25cbb2d426cb',
      ids: ['1da1a3cf-3f20-4e38-b23b-85f2c6fdac10'],
      withSender: true,
    };

    const originalSender = {
      _id: 'a7d2f7c6-4c45-48de-9de3-9f1c7f1d16bb',
      userAccount: {
        firstName: 'payever',
        lastName: 'payever',
      },
    };

    const originalMessaging = {
      _id: '9396a5fc-dfaa-455c-8a3f-25cbb2d426cb',
      salt: 'salt',
    };

    const originalMessage = {
      _id: 'fd5e5f68-1100-443d-9404-d998ef8fd305',
      deletedForUsers: [],
      status: 'sent',
      type: 'text',
      attachments: [],
      content: 'text',
      sentAt: {
        $date: '2021-06-14T13:38:45.261Z',
      },
      chat: 'bbd07634-5775-4301-a151-f1d2dc8f38be',
      editedAt: null,
      sender: originalSender._id,
      updatedAt: {
        $date: '2021-06-14T13:55:56.570Z',
      },
      components: [],
      createdAt: {
        $date: '2021-06-14T13:38:45.479Z',
      },
      __v: 0,
      toObject: () => originalMessage,
    };

    const clientSocket = {
      decodedToken: {
        user: {
          id: originalSender._id,
        },
      },
    }

    chatMessageService.findById.resolves(originalMessage as any);
    authorizationChecker.isGranted.resolves(true);
    commonMessagingService.findById.resolves(originalMessaging as any);

    const createForwardBoxMessageSpy = sandbox.spy(wsService as any, 'createForwardBoxMessage');
    const createForwardTextMessageSpy = sandbox.stub(wsService as any, 'createForwardTextMessage');
    chatMessageService.create.resolves([originalMessage as any]);

    await wsService.handleForwardMessages(
      clientSocket as any,
      dto,
    );

    expect(createForwardBoxMessageSpy.called).to.be.equal(false);
    expect(createForwardTextMessageSpy.called).to.be.equal(true);
    expect(chatMessageService.create.called).to.be.equal(true);
  });
});
