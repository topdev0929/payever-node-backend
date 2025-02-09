
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService } from '@pe/nest-kit/modules/discovery';
import {
  AuthorizationCheckerService,
  JwtAuthGuard,
  ModelFindPipe,
} from '@pe/nest-kit';

import * as chai from 'chai';
import * as sinon from 'sinon';

import { ChatMessagesController } from './../../../../src/http/controllers/chat-messages.controller';
import {
  ChatMessageService,
  CommonMessagingService,
} from '../../../../src/message/submodules/platform';
import { ForwardMessageHttpRequestDto } from '../../../../src/http/dto';
import { MessageElasticService } from '../../../../src/message/submodules/search-messages';
import { UsersService } from '../../../../src/projections';
import { IntegrationLinkService } from '../../../../src/message/submodules/integration-link';


const expect: Chai.ExpectStatic = chai.expect;

const chatMessageServiceStub = sinon.createStubInstance(ChatMessageService);
const commonMessagingServiceStub = sinon.createStubInstance(CommonMessagingService);
const messageElasticServiceStub = sinon.createStubInstance(MessageElasticService);
const usersServiceStub = sinon.createStubInstance(UsersService);
const integrationLinkServiceStub = sinon.createStubInstance(IntegrationLinkService);
const jwtServiceStub = sinon.createStubInstance(JwtService);
const jwtAuthGuardStub = sinon.createStubInstance(JwtAuthGuard);
const discoveryServiceStub = sinon.createStubInstance(DiscoveryService);
const modelFindPipeStub = sinon.createStubInstance(ModelFindPipe);

const authorizationCheckerStub = sinon.createStubInstance(
  AuthorizationCheckerService
);

describe('ChatMessagesController', () => {
  let chatMessagesController: ChatMessagesController;
  let sandbox: sinon.SinonSandbox;
  let chatMessageService: sinon.SinonStubbedInstance<ChatMessageService>;
  let commonMessagingService: sinon.SinonStubbedInstance<CommonMessagingService>;
  let authorizationChecker: sinon.SinonStubbedInstance<AuthorizationCheckerService>;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ChatMessagesController,
        {
          provide: AuthorizationCheckerService,
          useValue: authorizationCheckerStub,
        },
        {
          provide: JwtService,
          useValue: jwtServiceStub,
        },
        {
          provide: JwtAuthGuard,
          useValue: jwtAuthGuardStub,
        },
        {
          provide: DiscoveryService,
          useValue: discoveryServiceStub,
        },
        {
          provide: CommonMessagingService,
          useValue: commonMessagingServiceStub,
        },
        {
          provide: MessageElasticService,
          useValue: messageElasticServiceStub,
        },
        {
          provide: ChatMessageService,
          useValue: chatMessageServiceStub,
        },
        {
          provide: UsersService,
          useValue: usersServiceStub,
        },
        {
          provide: IntegrationLinkService,
          useValue: integrationLinkServiceStub,
        },
      ],
    }).overridePipe(ModelFindPipe)
    .useValue(modelFindPipeStub)
    .compile();
    
    chatMessagesController = module.get<ChatMessagesController>(ChatMessagesController);
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

    const dto: ForwardMessageHttpRequestDto = {
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

    const userToken = {
       id: originalSender._id,
    }

    const business = {};
    
    chatMessageService.findById.resolves(originalMessage as any);
    authorizationChecker.isGranted.resolves(true);
    commonMessagingService.findById.resolves(originalMessaging as any);

    const createForwardBoxMessageSpy = sandbox.spy(chatMessagesController as any, 'createForwardBoxMessage');
    const createForwardTextMessageSpy = sandbox.spy(chatMessagesController as any, 'createForwardTextMessage');
    chatMessageService.create.resolves([originalMessage as any]);

   await chatMessagesController.forwardMessages(
      userToken as any,
      business as any,
      '',
      originalMessaging as any,
      '',
      dto,
    );

    expect(createForwardBoxMessageSpy.called).to.be.equal(true);
    expect(createForwardTextMessageSpy.called).to.be.equal(false);
    expect(chatMessageService.create.called).to.be.equal(true);
  });

  it('Should forward text type messages', async () => {

    const dto: ForwardMessageHttpRequestDto = {
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
  
    const userToken = {
       id: originalSender._id,
    }

    const business = {};
    
    chatMessageService.findById.resolves(originalMessage as any);
    authorizationChecker.isGranted.resolves(true);
    commonMessagingService.findById.resolves(originalMessaging as any);

    const createForwardBoxMessageSpy = sandbox.spy(chatMessagesController as any, 'createForwardBoxMessage');
    const createForwardTextMessageSpy = sandbox.stub(chatMessagesController as any, 'createForwardTextMessage');
    chatMessageService.create.resolves([originalMessage as any]);

   await chatMessagesController.forwardMessages(
      userToken as any,
      business as any,
      '',
      originalMessaging as any,
      '',
      dto,
    );

    expect(createForwardBoxMessageSpy.called).to.be.equal(false);
    expect(createForwardTextMessageSpy.called).to.be.equal(true);
    expect(chatMessageService.create.called).to.be.equal(true);
  });
});
