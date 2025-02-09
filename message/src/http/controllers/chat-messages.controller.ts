import { v4 as uuid } from 'uuid';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  AbstractController,
  AclActionsEnum,
  Acl,
  Encryption,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';
import { ChatMessageStatusEnum, ChatMessageInteractiveInterface, AbstractChatMessageInterface } from '@pe/message-kit';
import {
  ChatMessageCreateHttpRequestDto,
  ChatMessageUpdateHttpRequestDto,
  DeleteMessagesHttpRequestDto,
  ForwardMessageHttpRequestDto,
  ChatMessageDeleteHttpRequestDto,
  ChatMessageInteractiveStatusHttpRequestDto,
} from '../dto';
import { EventOriginEnum } from '../../message';
import { MessageElasticService } from '../../message/submodules/search-messages';
import {
  MessageHttpResponseDto,
  PinMessageDto,
  PinnedMessageHttpResponseDto,
  UnpinMessageDto,
} from '../../message/dto';
import {
  AbstractChatMessage,
  AbstractChatMessageDocument,
  ChatMessageService,
  ChatTextMessage,
  ChatBoxMessageDocument,
  AbstractMessaging,
  AbstractMessagingDocument,
  CommonMessagingService,
  PinnedEmbeddedDocument,
  DecryptedAbstractChatMessageInterface,
  ChatBoxMessage,
  ChatTextMessageDocument,
} from '../../message/submodules/platform';
import { FastifyRequestLocal } from '../interfaces';
import {
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  CHAT_ID_PLACEHOLDER_C,
  BUSINESS_ID_PLACEHOLDER,
  CHAT_ID_PLACEHOLDER,
  CHAT_MESSAGE_ID_PLACEHOLDER_C,
  CHAT_MESSAGE_ID_PLACEHOLDER,
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER,
} from './const';
import { VoteCodes } from '../../message/const';
import { MENTIONS_REGEX } from '../../common';
import { messageToResponseDto, transformWithOptions } from '../../message/transformers';
import { UsersService, UserDocument } from '../../projections';
import { SearchResultInterface } from '../../message/submodules/search-messages/interfaces';
import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { IntegrationLinkDocument, IntegrationLinkService } from '../../message/submodules/integration-link';
import { IntegrationLinkInterface } from '../../message/submodules/integration-link/interfaces';

const MAX_MESSAGES: number = 50;

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/chats`)
@ApiTags('chat-messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin, RolesEnum.merchant, RolesEnum.user)
export class ChatMessagesController extends AbstractController {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    private readonly commonMessagingService: CommonMessagingService,
    private readonly messageElasticService: MessageElasticService,
    private readonly userService: UsersService,
    private readonly integrationLinkService: IntegrationLinkService
  ) {
    super();
  }

  @ApiResponse({ status: HttpStatus.OK, type: MessageHttpResponseDto })
  @Post(`${CHAT_ID_PLACEHOLDER_C}/messages`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async postMessage(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @Body() dto: ChatMessageCreateHttpRequestDto,
  ): Promise<MessageHttpResponseDto> {
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_MESSAGE,
      chat,
      { userToken },
      `You can't send messages to this ${chat.type}`,
    );
    if (dto.attachments && Array.isArray(dto.attachments) && dto.attachments.length > 0) {
      await this.denyAccessUnlessGranted(
        VoteCodes.SEND_MEDIA,
        chat,
        { userToken },
        `Member have no permission to post media to chat "${chat._id}"`,
      );
    }

    if (dto.type === 'text') {
      let content: string;
      let mentions: string[] = [];
      if (dto.content) {
        mentions = dto.content.match(MENTIONS_REGEX) || [];
        mentions = mentions.map((item: string) => item.replace('<@', '').replace('>', ''));

        content = await Encryption.encryptWithSalt(dto.content, chat.salt);
      }

      const contentType: string = dto.contentType ?
        await Encryption.encryptWithSalt(dto.contentType, chat.salt) : null;

      let replyToContent: string = '';
      const replyTo: string = (dto as any).replyTo;
      if (replyTo) {
        replyToContent = await this.chatMessageService.getReplyContent(replyTo);
      }

      const messagePrototype: ChatTextMessage = {
        _id: uuid(),
        attachments: [],
        data: { },
        sentAt: new Date(),
        ...dto,
        chat: chat._id,
        content,
        contentType,
        mentions,
        replyToContent: replyTo ? replyToContent : null,
        sender: userToken.id,
        status: ChatMessageStatusEnum.SENT,
        type: 'text',
      };

      const [newTextMessage]: ChatTextMessage[] =
        await this.chatMessageService.create([messagePrototype], EventOriginEnum.MerchantHttpServer);

      return messageToResponseDto(newTextMessage, {
        forUser: userToken.id,
      });
    }

    const toSave: AbstractChatMessageInterface = {
      _id: uuid(),
      sentAt: new Date(),
      ...dto,
      chat: chat._id,
    };
    const [newMessage]: AbstractChatMessageInterface[] = await this.chatMessageService.create(
      [toSave],
      EventOriginEnum.MerchantHttpServer,
    );

    return messageToResponseDto(newMessage, {
      forUser: userToken.id,
    });
  }

  @ApiResponse({ status: HttpStatus.OK, type: [MessageHttpResponseDto] })
  @Get(`${CHAT_ID_PLACEHOLDER_C}/messages`)
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  public async getMessages(
    @User() userToken: UserTokenInterface,
    @Query() query: FastifyRequestLocal['query'],
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
  ): Promise<MessageHttpResponseDto[]> {
    await this.denyAccessUnlessGranted(VoteCodes.READ_MESSAGING, chat, { userToken });
    const limit: number = Math.min(MAX_MESSAGES, +query.limit || MAX_MESSAGES);
    const messages: AbstractChatMessageDocument[] = await this.chatMessageService.find({
      chat: chat._id,
      deletedForUsers: { $ne: userToken.id },
    }).sort({
      createdAt: -1,
    }).limit(limit);

    return (await Promise.all(
      messages
        .reverse()
        .map((msg: AbstractChatMessageDocument) => this.commonMessagingService.decryptMessage(msg, chat.salt),
      ),
    )).map(transformWithOptions(messageToResponseDto)({
      forUser: userToken.id,
    }));
  }

  @ApiResponse({ status: HttpStatus.OK, type: [MessageHttpResponseDto] })
  @Get(`${CHAT_ID_PLACEHOLDER_C}/search`)
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  public async searchMessages(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @Query('query') query: string,
  ): Promise<MessageHttpResponseDto[]> {
    await this.denyAccessUnlessGranted(VoteCodes.READ_MESSAGING, chat, { userToken });
    const searchResult: SearchResultInterface = await this.messageElasticService.searchMessages(chat._id, query);

    const messages: AbstractChatMessageDocument[] = await this.chatMessageService.find({
      _id: { $in: searchResult.identifiers },
      deletedForUsers: { $ne: userToken.id },
    }).sort({
      createdAt: -1,
    });

    return (await this.commonMessagingService.decryptMessagesWithSalt(messages, chat.salt))
      .reverse()
      .map(transformWithOptions(messageToResponseDto)({
        forUser: userToken.id,
      }));
  }

  @ApiResponse({ status: HttpStatus.OK, type: [MessageHttpResponseDto] })
  @Get(`${CHAT_ID_PLACEHOLDER_C}/info`)
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  public async getInfo(
    @User() userToken: UserTokenInterface,
    @Query() query: FastifyRequestLocal['query'],
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
  ): Promise<MessageHttpResponseDto[]> {
    await this.denyAccessUnlessGranted(VoteCodes.READ_MESSAGING, chat, { userToken });
    const limit: number = Math.min(MAX_MESSAGES, +query.limit || MAX_MESSAGES);
    const messages: AbstractChatMessageDocument[] = await this.chatMessageService.find({
      attachments: { $exists: true, $ne: [] },
      chat: chat._id,
      deletedForUsers: { $ne: userToken.id },
    }).sort({
      createdAt: -1,
    }).limit(limit);

    return (await this.commonMessagingService.decryptMessagesWithSalt(messages, chat.salt))
      .reverse()
      .map(transformWithOptions(messageToResponseDto)({
        forUser: userToken.id,
      }));
  }

  @ApiResponse({ status: HttpStatus.OK, type: undefined })
  @Post(`${CHAT_ID_PLACEHOLDER_C}/clear-history`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async clearHistory(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_MESSAGE,
      chat,
      { userToken },
      `You have no permission to post to chat "${chat._id}"`,
    );

    return this.chatMessageService.deleteChatHistory(
      chat._id,
      EventOriginEnum.MerchantHttpServer,
    );
  }

  @ApiResponse({ status: HttpStatus.OK, type: [MessageHttpResponseDto] })
  @Post(`${CHAT_ID_PLACEHOLDER_C}/forward-messages`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async forwardMessages(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) targetChat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @Body() dto: ForwardMessageHttpRequestDto,
  ): Promise<MessageHttpResponseDto[]> {
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_MESSAGE,
      targetChat,
      { userToken },
      `You can't send messages to this ${targetChat.type}`,
    );

    const prototypes: Array<ChatTextMessage | ChatBoxMessage> = [];
    for (const _id of dto.ids) {

      const originalMessage: AbstractChatMessageDocument =
        await this.chatMessageService.findById(_id);

      if (!originalMessage) {
        continue;
      }

      if (ChatTextMessage.isTypeOf(originalMessage)) {
        prototypes.push(
          await this.createForwardTextMessage(
            originalMessage,
            userToken,
            dto,
            targetChat,
            _id,
          ),
        );
      }

      if (ChatBoxMessage.isTypeOf(originalMessage)) {
        prototypes.push(
          await this.createForwardBoxMessage(
            originalMessage,
            userToken,
            dto,
            targetChat,
            _id,
          ),
        );
      }
    }

    const forwardedMessages: Array<ChatTextMessage | ChatBoxMessage> = await this.chatMessageService.create(
      prototypes,
      EventOriginEnum.MerchantHttpServer,
    );

    return forwardedMessages.map(transformWithOptions(messageToResponseDto)({
      forUser: userToken.id,
    }));
  }

  @ApiResponse({ status: HttpStatus.OK, type: [MessageHttpResponseDto] })
  @Get(`${CHAT_ID_PLACEHOLDER_C}/pinned-messages`)
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  public async getPinnedMessages(
    @Query() query: BaseQueryDto,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @User() userToken: UserTokenInterface,
  ): Promise<PinnedMessageHttpResponseDto[]> {
    await this.denyAccessUnlessGranted(VoteCodes.READ_MESSAGING, chat, { userToken });

    if (!chat.pinned || !chat.pinned.length) {
      return [];
    }

    const messages: AbstractChatMessageDocument[] = await this.chatMessageService.find({
      _id: {
        $in: chat.pinned.map(
          (item: PinnedEmbeddedDocument) => item.messageId,
        ),
      },
      deletedForUsers: { $ne: userToken.id },
      status: { $ne: ChatMessageStatusEnum.DELETED },
    }).sort({
      createdAt: -1,
    });

    const reversedPinnedMessages: PinnedEmbeddedDocument[] = [...chat.pinned].reverse();

    const populatedPinnedMessages: PinnedMessageHttpResponseDto[] = await Promise.all(reversedPinnedMessages
      .map((pinned: PinnedEmbeddedDocument) => {
        const message: AbstractChatMessageDocument =
          messages.find((m: AbstractChatMessageDocument) => m._id === pinned.messageId);
        if (!message) {
          return null;
        }

        return new Promise<PinnedMessageHttpResponseDto>((resolve: any, reject: any): void => {
          this.commonMessagingService.decryptMessage(message, chat.salt)
            .catch(reject)
            .then((data: DecryptedAbstractChatMessageInterface) => {
              const dto: MessageHttpResponseDto =
                transformWithOptions(messageToResponseDto)({ forUser: userToken.id })(data);
              resolve({
                ...dto,
                forAllUsers: pinned.forAllUsers,
                pinId: pinned._id,
                pinner: pinned.pinner,
              });
            });
        });
      }));

    return populatedPinnedMessages
      .filter((item: PinnedMessageHttpResponseDto) => !!item)
      .slice((query.page - 1) * query.limit, query.page * query.limit);
  }

  @ApiResponse({ status: HttpStatus.OK, type: undefined })
  @Delete(`${CHAT_ID_PLACEHOLDER_C}/delete-messages`)
  @Acl({ microservice: 'message', action: AclActionsEnum.delete })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteMessages(
    @User() user: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @Body() dto: DeleteMessagesHttpRequestDto,
  ): Promise<void> {
    //  TODO: check permissions
    for (const id of dto.ids) {
      await this.chatMessageService.delete(
        id,
        EventOriginEnum.MerchantHttpServer,
        dto.deleteForEveryone ? null : user,
      );
    }
  }

  @ApiResponse({ status: HttpStatus.OK, type: MessageHttpResponseDto })
  @Patch(`${CHAT_ID_PLACEHOLDER_C}/messages/${CHAT_MESSAGE_ID_PLACEHOLDER_C}`)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  // tslint:disable-next-line: parameters-max-number
  public async editMessage(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @ParamModel({
      _id: CHAT_MESSAGE_ID_PLACEHOLDER_C,
      chat: CHAT_ID_PLACEHOLDER_C,
    }, AbstractChatMessage.name, true) message: AbstractChatMessageDocument,
    @Param(CHAT_MESSAGE_ID_PLACEHOLDER) swaggerChatMessageId: string,
    @Body() dto: ChatMessageUpdateHttpRequestDto,
    @User() userToken: UserTokenInterface,
  ): Promise<MessageHttpResponseDto> {
    await this.denyAccessUnlessGranted(VoteCodes.EDIT_MESSAGE, message, { chat, userToken });
    if (ChatTextMessage.isTypeOf(message)) {
      let mentions: string[] = [];
      if (dto.content) {
        mentions = dto.content.match(MENTIONS_REGEX) || [];
        mentions = mentions.map((item: string) => item.replace('<@', '').replace('>', ''));

        dto.content = await Encryption.encryptWithSalt(dto.content, chat.salt);
      }

      if (dto.contentType !== undefined) {
        dto.contentType = await Encryption.encryptWithSalt(dto.contentType, chat.salt);
      }


      return messageToResponseDto(
        await this.chatMessageService.update(
          {
            _id: message._id,

            $set: {
              ...dto,
              mentions: dto.content ? mentions : message.mentions,
            },
          },
          EventOriginEnum.MerchantHttpServer,
        ),
        {
          forUser: userToken.id,
        },
      );
    } else {
      return messageToResponseDto(
        await this.chatMessageService.update(
          {
            _id: message._id,

            $set: dto,
          },
          EventOriginEnum.MerchantHttpServer,
        ),
        {
          forUser: userToken.id,
        },
      );
    }
  }

  @Delete(`${CHAT_ID_PLACEHOLDER_C}/messages/${CHAT_MESSAGE_ID_PLACEHOLDER_C}`)
  @Acl({ microservice: 'message', action: AclActionsEnum.delete })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteMessage(
    @User() user: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @ParamModel({
      _id: CHAT_MESSAGE_ID_PLACEHOLDER_C,
      chat: CHAT_ID_PLACEHOLDER_C,
    }, AbstractChatMessage.name) message: AbstractChatMessageDocument,
    @Body() dto: ChatMessageDeleteHttpRequestDto,
    @User() userToken: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(VoteCodes.DELETE_MESSAGE, message, { chat, userToken });

    return this.chatMessageService.delete(
      message._id,
      EventOriginEnum.MerchantHttpServer,
      dto.deleteForEveryone ? null : user,
    );
  }

  @ApiResponse({ status: HttpStatus.OK, type: MessageHttpResponseDto })
  @Post(`${CHAT_ID_PLACEHOLDER_C}/messages/${CHAT_MESSAGE_ID_PLACEHOLDER_C}/pin`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  @HttpCode(HttpStatus.OK)
  public async pinMessage(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @ParamModel({
      _id: CHAT_MESSAGE_ID_PLACEHOLDER_C,
      chat: CHAT_ID_PLACEHOLDER_C,
    }, AbstractChatMessage.name) message: AbstractChatMessageDocument,
    @Param(CHAT_MESSAGE_ID_PLACEHOLDER) swaggerChatMessageId: string,
    @Body() dto: PinMessageDto,
    @User() userToken: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(
      VoteCodes.PIN_MESSAGE,
      chat,
      { userToken },
      `You can't send message to this ${chat.type}`,
    );

    const decryptedMessage: DecryptedAbstractChatMessageInterface =
      await this.commonMessagingService.decryptMessage(message, chat.salt);

    const messageHttpReponseDto: MessageHttpResponseDto =
      transformWithOptions(messageToResponseDto)({ forUser: null })(decryptedMessage);

    const userId: string = userToken.id;
    const pinId: string = uuid();
    await this.commonMessagingService.pinMessage(
      message.chat,
      {
        _id: pinId,
        forAllUsers: dto.forAllUsers,
        messageId: message._id,
        notifyAllMembers: dto.notifyAllMembers,
        pinner: userId,
      },
      EventOriginEnum.MerchantHttpServer,
      messageHttpReponseDto,
    );
  }

  @ApiResponse({ status: HttpStatus.OK, type: MessageHttpResponseDto })
  @Delete(`${CHAT_ID_PLACEHOLDER_C}/messages/${CHAT_MESSAGE_ID_PLACEHOLDER_C}/pin`)
  @Acl({ microservice: 'message', action: AclActionsEnum.delete })
  public async unpinMessage(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @ParamModel({
      _id: CHAT_MESSAGE_ID_PLACEHOLDER_C,
      chat: CHAT_ID_PLACEHOLDER_C,
    }, AbstractChatMessage.name) message: AbstractChatMessageDocument,
    @Param(CHAT_MESSAGE_ID_PLACEHOLDER) swaggerChatMessageId: string,
    @Body() dto: UnpinMessageDto,
    @User() userToken: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(
      VoteCodes.PIN_MESSAGE,
      chat,
      { userToken },
      `You can't send message to this ${chat.type}`,
    );

    await this.commonMessagingService.unpinMessage(
      message.chat,
      dto.pinId,
      EventOriginEnum.MerchantHttpServer,
    );
  }

  @ApiResponse({ status: HttpStatus.OK, type: MessageHttpResponseDto })
  @Post(`${CHAT_ID_PLACEHOLDER_C}/messages/${CHAT_MESSAGE_ID_PLACEHOLDER_C}/marked`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  @HttpCode(HttpStatus.OK)
  public async setMessageStatus(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @ParamModel({
      _id: CHAT_MESSAGE_ID_PLACEHOLDER_C,
      chat: CHAT_ID_PLACEHOLDER_C,
      type: { $eq: 'box' },
    }, AbstractChatMessage.name) message: ChatBoxMessageDocument,
    @Param(CHAT_MESSAGE_ID_PLACEHOLDER) swaggerChatMessageId: string,
    @Body() dto: ChatMessageInteractiveStatusHttpRequestDto,
  ): Promise<MessageHttpResponseDto> {
    //  TODO: check permission
    if (message.type !== 'box') {
      throw new ForbiddenException('Only messages with type=\'box\' can be marked');
    }

    const interactive: ChatMessageInteractiveInterface = message.toObject().interactive;

    return messageToResponseDto(
      await this.chatMessageService.update(
        {
          _id: message._id,

          $set: {
            interactive: {
              ...interactive,
              marked: dto.marked,
            },
          },
        },
        EventOriginEnum.MerchantHttpServer,
      ),
      {
        forUser: userToken.id,
      },
    );
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Post(`${CHAT_ID_PLACEHOLDER_C}/integration-link`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async generateUniqueLinkForChat(
    @User() user: UserTokenInterface,
    @Param(CHAT_ID_PLACEHOLDER) chat: string,
    @Param(BUSINESS_ID_NON_GUARDED_PLACEHOLDER) business: string,
  ): Promise<IntegrationLinkInterface> {

    if (!chat || !business) {
      throw new NotFoundException('chat or business can not be empty');
    }
    const existLink : IntegrationLinkInterface = await this.integrationLinkService.findOne({
      business,
      chat,
    });
    if (existLink) {
      return existLink;
    }

    return this.integrationLinkService.create({
      business,
      chat,
      creator: user.id,
    });
  }


  private async createForwardBoxMessage(
    originalMessage: ChatBoxMessageDocument,
    userToken: UserTokenInterface,
    dto: ForwardMessageHttpRequestDto,
    targetChat: AbstractMessagingDocument,
    _id: string,
  ): Promise<ChatBoxMessage> {
    const originalMessaging: AbstractMessagingDocument =
      await this.commonMessagingService.findById(originalMessage.chat);

    await this.denyAccessUnlessGranted(
      VoteCodes.READ_MESSAGING,
      originalMessaging,
      { userToken },
    );

    const forwardSender: boolean = !('withSender' in dto) || dto.withSender;

    const originalSender: UserDocument =
      forwardSender &&
      (await this.userService.findById(originalMessage.sender));

    const boxMessagePrototype: ChatBoxMessage = {
      ...originalMessage.toObject(),
      _id: uuid(),
      chat: targetChat._id,
      forwardFrom: {
        _id,
        messaging: originalMessaging._id,
        messagingTitle: originalMessaging.title,
        sender: originalSender?._id,
        senderTitle:
          (originalSender &&
            [
              originalSender?.userAccount?.firstName,
              originalSender?.userAccount?.lastName,
            ].join(' ')) ||
          undefined,
      },
      sender: userToken.id,
      sentAt: new Date(),
      status: ChatMessageStatusEnum.SENT,
      type: 'box',
    };

    return boxMessagePrototype;
  }

  private async createForwardTextMessage(
    originalMessage: ChatTextMessageDocument,
    userToken: UserTokenInterface,
    dto: ForwardMessageHttpRequestDto,
    targetChat: AbstractMessagingDocument,
    _id: string,
  ): Promise<ChatTextMessage> {
    const originalMessaging: AbstractMessagingDocument =
      await this.commonMessagingService.findById(originalMessage.chat);

    await this.denyAccessUnlessGranted(
      VoteCodes.READ_MESSAGING,
      originalMessaging,
      { userToken },
    );

    const forwardSender: boolean = !('withSender' in dto) || dto.withSender;

    const originalSender: UserDocument =
      forwardSender &&
      (await this.userService.findById(originalMessage.sender));

    const decodedContent: string = await Encryption.decryptWithSalt(
      originalMessage.content,
      originalMessaging.salt,
    );

    const textMessagePrototype: ChatTextMessage = {
      attachments: [],
      ...originalMessage.toObject(),
      _id: uuid(),
      chat: targetChat._id,
      content: await Encryption.encryptWithSalt(
        decodedContent,
        targetChat.salt,
      ),
      forwardFrom: {
        _id,
        messaging: originalMessaging._id,
        messagingTitle: originalMessaging.title,
        sender: originalSender?._id,
        senderTitle:
          (originalSender &&
            [
              originalSender?.userAccount?.firstName,
              originalSender?.userAccount?.lastName,
            ].join(' ')) ||
          undefined,
      },
      sender: userToken.id,
      sentAt: new Date(),
      status: ChatMessageStatusEnum.SENT,
      type: 'text',
    };

    return textMessagePrototype;
  }
}
