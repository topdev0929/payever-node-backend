import {
  Inject,
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  AclActionsEnum,
  Acl,
  User,
  UserTokenInterface,
  AbstractController,
} from '@pe/nest-kit';
import { FilterQuery, LeanDocument } from 'mongoose';
import { ChatInviteCreateHttpRequestDto } from '../dto';
import { ChatInviteDocument, ChatInviteService, ChatInviteSchemaName } from '../../message/submodules/invites';
import {
  AbstractMessaging,
  AbstractMessagingDocument,
  ChatInvitedMember,
  CommonMessagingService,
} from '../../message/submodules/platform';
import { FastifyRequestLocal } from '../interfaces';
import {
  BUSINESS_ID_PLACEHOLDER,
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  CHAT_ID_PLACEHOLDER_C,
  CHAT_ID_PLACEHOLDER,
  CHAT_INVITE_ID_PLACEHOLDER_C,
  CHAT_INVITE_ID_PLACEHOLDER,
} from './const';
import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';
import { RpcService } from '../../message';
import { ContactsAppContactFieldRpcResponseDto, ContactsAppContactRpcResponseDto } from '../../message/dto';
import { VoteCodes } from '../../message/const';
import { UserDocument } from '../../projections';


@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/chats/${CHAT_ID_PLACEHOLDER_C}/invites`)
@ApiTags('chat-invites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin, RolesEnum.merchant)
export class ChatInvitesController extends AbstractController {
  @Inject() private readonly rpcService: RpcService;
  @Inject() private readonly chatInviteService: ChatInviteService;
  @Inject() private readonly commonMessagingService: CommonMessagingService;

  @Post()
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async createChatInvite(
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @Body() dto: ChatInviteCreateHttpRequestDto,
    @User() userToken: UserTokenInterface,
  ): Promise<ChatInviteDocument> {
    await this.denyAccessUnlessGranted(
      VoteCodes.UPDATE_MESSAGING,
      chat,
      {
        userToken,
      },
      `You have no permission to create invites to ${chat.type} "${chat._id}"`,
    );

    return this.chatInviteService.create({
      ...dto,
      chat: chat._id,
    });
  }

  @Get()
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  public async findAllChatInvites(
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @Query() query: FastifyRequestLocal['query'],
    @User() userToken: UserTokenInterface,
  ): Promise<Array<LeanDocument<ChatInviteDocument>>> {
    await this.denyAccessUnlessGranted(VoteCodes.READ_MESSAGING, chat, { userToken });
    const filter: FilterQuery<ChatInviteDocument> = JSON.parse(query.filter || '{}');

    return this.chatInviteService.find({
      ...filter,
      chat: chat._id,
    });
  }

  @Get(CHAT_INVITE_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  public async findChatInviteById(
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @ParamModel({
      _id: CHAT_INVITE_ID_PLACEHOLDER_C,
      chat: CHAT_ID_PLACEHOLDER_C,
    }, ChatInviteSchemaName, true) chatInvite: ChatInviteDocument,
    @Param(CHAT_INVITE_ID_PLACEHOLDER) swaggerChatInviteId: string,
    @User() userToken: UserTokenInterface,
  ): Promise<LeanDocument<ChatInviteDocument>> {
    await this.denyAccessUnlessGranted(VoteCodes.READ_MESSAGING, chat, { userToken });
    if (chatInvite.chat !== chat._id) {
      throw new NotFoundException('ChatInvite not found');
    }

    return chatInvite;
  }

  @Get(`invited-members`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  // tslint:disable-next-line: parameters-max-number
  public async getAllInvitedMembers(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @User() userToken: UserTokenInterface,
  ): Promise<ChatInvitedMember[]> {
    await this.denyAccessUnlessGranted(
      VoteCodes.READ_MESSAGING_MEMBERS,
      chat,
      { userToken },
      `You have no permission to read chat members for ${chat.type} "${chat._id}"`,
    );

    return chat.invitedMembers;
  }

  @Delete(`invited-members/:invitedMemberId`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  // tslint:disable-next-line: parameters-max-number
  public async deleteInvitedMember(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param('invitedMemberId') invitedMemberId: string,
    @User() userToken: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(
      VoteCodes.READ_MESSAGING_MEMBERS,
      chat,
      { userToken },
      `You have no permission to read chat members for ${chat.type} "${chat._id}"`,
    );

    await this.commonMessagingService.removeInvitedMember(chat, { _id: invitedMemberId });
  }

  @Post(`${CHAT_INVITE_ID_PLACEHOLDER_C}/send-to-email/:email`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  // tslint:disable-next-line: parameters-max-number
  public async sendChatInviteToEmail(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName, true) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @ParamModel({
      _id: CHAT_INVITE_ID_PLACEHOLDER_C,
      chat: CHAT_ID_PLACEHOLDER_C,
    }, ChatInviteSchemaName, true) invitation: ChatInviteDocument,
    @Param(CHAT_INVITE_ID_PLACEHOLDER) swaggerChatInviteId: string,
    @Param('email') email: string,
    @User() userToken: UserTokenInterface,
  ): Promise<ChatInviteDocument> {
    await this.denyAccessUnlessGranted(
      VoteCodes.INCLUDE_MEMBER,
      chat,
      { userToken },
      `You have no permission to invite to ${chat.type} "${chat._id}"`,
    );

    if (chat.invitedMembers?.some((m: ChatInvitedMember) => m.email === email)) {
      throw new BadRequestException(`contact by email '${email}' is already invited.`);
    }

    const addedUser: UserDocument = await this.commonMessagingService.tryAddMemberByEmail(
      chat,
      email,
      userToken.id,
    );

    if (addedUser) {
      await this.chatInviteService.sendInvitationByEmail(
        { business, chat, invitation, user: userToken },
        email,
        'message_invitation',
      );

      return invitation;
    }

    await this.commonMessagingService.addOrUpdateInvitedMember(
      chat,
      {
        email,
      } as any,
    );

    await this.chatInviteService.sendInvitationByEmail(
      { business, chat, invitation, user: userToken },
      email,
      'message_invitation',
    );

    return invitation;
  }

  @Post(`${CHAT_INVITE_ID_PLACEHOLDER_C}/send-to-contact/:contactId`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  // tslint:disable-next-line: parameters-max-number
  public async sendChatInviteToContact(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName, true) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @ParamModel({
      _id: CHAT_INVITE_ID_PLACEHOLDER_C,
      chat: CHAT_ID_PLACEHOLDER_C,
    }, ChatInviteSchemaName, true) invitation: ChatInviteDocument,
    @Param(CHAT_INVITE_ID_PLACEHOLDER) swaggerChatInviteId: string,
    @Param('contactId') contactId: string,
    @User() userToken: UserTokenInterface,
  ): Promise<ChatInviteDocument> {
    await this.denyAccessUnlessGranted(
      VoteCodes.INCLUDE_MEMBER,
      chat,
      { userToken },
      `You have no permission to invite to ${chat.type} "${chat._id}"`,
    );

    const contact: ContactsAppContactRpcResponseDto = await this.rpcService.getContactById(contactId, business._id);

    if (!contact) {
      throw new NotFoundException(`Contact "${contactId}" not found`);
    }

    const emailValue: string = contact.fields.find(
      (field: ContactsAppContactFieldRpcResponseDto) => field.field.name === 'email',
    )?.value;

    if (!emailValue) {
      throw new NotFoundException(`Email of contact "${contactId}" not found`);
    }

    if (chat.invitedMembers?.some((m: ChatInvitedMember) => m.email === emailValue)) {
      throw new ConflictException(`contact by email '${emailValue}' is already invited.`);
    }

    const addedUser: UserDocument = await this.commonMessagingService.tryAddMemberByEmail(
      chat,
      emailValue,
      userToken.id,
    );

    if (addedUser) {
      return invitation;
    }
    await this.commonMessagingService.addOrUpdateInvitedMember(
      chat,
      {
        contactId,
        email: emailValue,
      },
    );

    await this.chatInviteService.sendInvitationByEmail(
      { business, chat, invitation, user: userToken },
      emailValue,
      'message_invitation',
    );


    return invitation;
  }

  @Delete(CHAT_INVITE_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.delete })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteChatInvite(
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @ParamModel({
      _id: CHAT_INVITE_ID_PLACEHOLDER_C,
    }, ChatInviteSchemaName, true) chatInvite: ChatInviteDocument,
    @Param(CHAT_INVITE_ID_PLACEHOLDER) swaggerChatInviteId: string,
    @User() userToken: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(
      VoteCodes.UPDATE_MESSAGING,
      chat,
      {
        userToken,
      },
      `You have no permission to create invites to ${chat.type} "${chat._id}"`,
    );
    await this.chatInviteService.delete(chatInvite._id);
  }
}
