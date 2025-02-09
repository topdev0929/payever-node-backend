import { v4 as uuid } from 'uuid';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  User,
  UserTokenInterface,
  AclActionsEnum,
  Acl,
  AbstractController,
} from '@pe/nest-kit';
import {
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  CHAT_ID_PLACEHOLDER_C,
  CHAT_ID_PLACEHOLDER,
  CHAT_DRAFT_MESSAGE_ID_PLACEHOLDER_C,
} from './const';
import {
  ChatDraftMessage,
  ChatDraftMessageDocument,
  ChatDraftsMessageService,
} from '../../message/submodules/draft-messages';
import {
  AbstractMessaging,
  AbstractMessagingDocument,
} from '../../message/submodules/platform';
import {
  ChatDraftMessageCreateHttpRequestDto,
  ChatDraftMessageUpdateHttpRequestDto,
} from '../dto/incoming';
import { VoteCodes } from '../../message/const';



@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/chats/${CHAT_ID_PLACEHOLDER_C}/messages/drafts`)
@ApiTags('chat-draft-messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin, RolesEnum.merchant)
export class ChatDraftMessagesController extends AbstractController {
  constructor(
    private readonly chatDraftMessagesService: ChatDraftsMessageService,
  ) {
    super();
  }

  @Get()
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  public async getDrafts(
    @User() user: UserTokenInterface,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
  ): Promise<ChatDraftMessageDocument[]> {
    return this.chatDraftMessagesService.find({
      chat: chat._id,
      sender: user.id,
    });
  }

  @Post()
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async createDraft(
    @User() userToken: UserTokenInterface,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @Body() dto: ChatDraftMessageCreateHttpRequestDto,
  ): Promise<ChatDraftMessageDocument> {
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_MESSAGE,
      chat,
      { userToken },
      `You can't send messages to this ${chat.type}`,
    );
    await this.chatDraftMessagesService.deleteByFilter({
      chat: chat._id,
      sender: userToken.id,
    });

    return this.chatDraftMessagesService.create({
      ...dto,
      _id: uuid(),
      chat: chat._id,
      sender: userToken.id,
      sentAt: new Date(),
      type: 'text',
    });
  }

  @Patch(CHAT_DRAFT_MESSAGE_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async updateDraft(
    @User() userToken: UserTokenInterface,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @ParamModel({
      _id: CHAT_DRAFT_MESSAGE_ID_PLACEHOLDER_C,
      chat: CHAT_ID_PLACEHOLDER_C,
    }, ChatDraftMessage.name) draftMessage: ChatDraftMessageDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerDraftMessageId: string,
    @Body() dto: ChatDraftMessageUpdateHttpRequestDto,
  ): Promise<ChatDraftMessageDocument> {
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_MESSAGE,
      chat,
      { userToken },
      `You can't send messages to this ${chat.type}`,
    );
    if (draftMessage.sender !== userToken.id) {
      throw new ForbiddenException(`You have no access to draft message ${draftMessage._id}`);
    }

    return this.chatDraftMessagesService.update({
      ...dto,
      _id: draftMessage._id,
    });
  }

  @Delete(CHAT_DRAFT_MESSAGE_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.delete })
  public async deleteDraft(
    @User() userToken: UserTokenInterface,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @ParamModel({
      _id: CHAT_DRAFT_MESSAGE_ID_PLACEHOLDER_C,
      chat: CHAT_ID_PLACEHOLDER_C,
    }, ChatDraftMessage.name) draftMessage: ChatDraftMessageDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerDraftMessageId: string,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_MESSAGE,
      chat,
      { userToken },
      `You can't send messages to this ${chat.type}`,
    );
    await this.chatDraftMessagesService.deleteByFilter({
      _id: draftMessage._id,
      chat: chat._id,
      sender: userToken.id,
    });
  }
}
