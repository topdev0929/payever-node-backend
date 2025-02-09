
import { v4 as uuid } from 'uuid';
import {
  Controller,
  Inject,
  Post,
  Param,
  Body,
  UseGuards,
  HttpStatus,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  User,
  UserTokenInterface,
  AbstractController,
  AclActionsEnum,
  Acl,
} from '@pe/nest-kit';
import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';

import { ChatMemberRoleEnum, MessagingTypeEnum } from '@pe/message-kit';
import {
  DirectChatCreateHttpRequestDto,
} from '../dto';
import {
  EventOriginEnum,
  AddMemberMethodEnum,
  RpcService,
  ProfileService,
  ProfileDocument,
} from '../../message';
import {
  CommonChannelHttpResponseDto,
  DirectChatHttpResponseDto,
} from '../../message/dto';
import {
  DirectChatService,
  DirectChatDocument,
} from '../../message/submodules/messaging/direct-chat';
import {
  CommonMessagingService,
} from '../../message/submodules/platform';
import {
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  BUSINESS_ID_PLACEHOLDER,
} from './const';
import { directChatToResponseDto } from '../../message/transformers';
import { UsersService } from '../../projections';
import { UserDocument } from '../../projections/models';
import { ContactsAppContactFieldRpcResponseDto, ContactsAppContactRpcResponseDto } from 'src/message/dto';
import { ChatInviteService } from '../../message/submodules/invites';

@Controller()
@ApiTags('messaging/direct-chats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DirectChatsController extends AbstractController {
  @Inject() private readonly chatInviteService: ChatInviteService;
  @Inject() private readonly rpcService: RpcService;
  @Inject() private readonly profileService: ProfileService;
  constructor(
    private readonly directChatService: DirectChatService,
    private readonly commonMessagingService: CommonMessagingService,
    private readonly userService: UsersService,
  ) {
    super();
  }

  @Roles(RolesEnum.merchant)
  @Post(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/messaging/direct-chat/invite-email/:email`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async sendInviteToEmail(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Param('email') email: string,
    @User() user: UserTokenInterface,
  ): Promise<void> {
    const userProfileDocument: ProfileDocument = await this.profileService.findById(user.id);
    const identifier: string = userProfileDocument?.username ? `@${userProfileDocument?.username}` : user.id;
    await this.chatInviteService.sendInvitationByEmail(
      {
        business,
        user: {
          email: user.email,
          firstName: user.firstName,
          id: user.id,
          identifier,
          lastName: user.lastName,
        },
      },
      email,
      'message_direct_chat_invitation',
    );
  }

  @Roles(RolesEnum.merchant)
  @Post(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/messaging/direct-chat/invite-contact/:contactId`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async sendInvitateToContact(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Param('contactId') contactId: string,
    @User() user: UserTokenInterface,
  ): Promise<void> {
    const userProfileDocument: ProfileDocument = await this.profileService.findById(user.id);

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

    const identifier: string = userProfileDocument?.username ? `@${userProfileDocument?.username}` : user.id;

    await this.chatInviteService.sendInvitationByEmail(
      {
        business,
        user: {
          email: user.email,
          firstName: user.firstName,
          id: user.id,
          identifier,
          lastName: user.lastName,
        },
      },
      emailValue,
      'message_direct_chat_invitation',
    );
  }

  @Roles(RolesEnum.merchant)
  @ApiResponse({ status: HttpStatus.OK, type: [CommonChannelHttpResponseDto] })
  @Post(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/messaging/direct-chat`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async createDirectChatCompat(
    @Body() dto: DirectChatCreateHttpRequestDto,
    @User() user: UserTokenInterface,
  ): Promise<DirectChatHttpResponseDto> {
    return this.createDirectChat(dto, user);
  }

  @Roles(RolesEnum.merchant, RolesEnum.user, RolesEnum.customer)
  @ApiResponse({ status: HttpStatus.OK, type: [CommonChannelHttpResponseDto] })
  @Post(`messaging/direct-chat`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async createDirectChat(
    @Body() dto: DirectChatCreateHttpRequestDto,
    @User() user: UserTokenInterface,
  ): Promise<DirectChatHttpResponseDto> {
    if (dto.peer.startsWith('@')) {
      const [profile]: ProfileDocument[] = await this.profileService.find({
        username: dto.peer.slice(1),
      });
      if (!profile) {
        throw new NotFoundException(`User by ${dto.peer} not found`);
      }
      dto.peer = profile._id;
    }

    const existingChat: DirectChatDocument = await this.directChatService.findOne({
      $and: [{
        'members.user': user.id,
      }, {
        'members.user': dto.peer,
      }],
      deleted: {
        $ne: true,
      },
    });

    if (existingChat) {
      throw new ConflictException(`Chat with '${dto.peer}' already`
        + ` exists: id = '${existingChat._id}', deleted = ${existingChat.deleted}`);
    }

    const peerUser: UserDocument = await this.userService.findById(dto.peer);

    if (!peerUser) {
      throw new NotFoundException(`Peer with id "${dto.peer}" not found`);
    }

    const defaultTitle: string = [
      peerUser.userAccount?.firstName,
      peerUser.userAccount?.lastName,
    ].filter(Boolean).join(' ') || peerUser.userAccount?.email || dto.peer;

    const directChat: DirectChatDocument = await this.directChatService.create({
      _id: uuid(),
      deleted: false,
      lastMessages: [],
      members: [{
        addMethod: AddMemberMethodEnum.OWNER,
        addedBy: user.id,
        role: ChatMemberRoleEnum.Admin,
        user: user.id,
      }, {
        addMethod: AddMemberMethodEnum.INCLUDE,
        addedBy: user.id,
        role: ChatMemberRoleEnum.Member,
        user: dto.peer,
      }],
      salt: this.commonMessagingService.createSalt(),
      title: dto.title || defaultTitle,
      type: MessagingTypeEnum.DirectChat,
    }, EventOriginEnum.MerchantHttpServer);

    return directChatToResponseDto(directChat);
  }
}
