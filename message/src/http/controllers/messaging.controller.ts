import {
  Controller,
  Get,
  Delete,
  Query,
  Param,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
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
import { EsFolderItemInterface } from '@pe/folders-plugin';
import { FilterQuery } from 'mongoose';
import {
  CommonMessagingService,
  AbstractMessaging,
  AbstractMessagingDocument,
  ChatMessageService,
} from '../../message/submodules/platform';
import { FastifyRequestLocal } from '../interfaces';
import {
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  BUSINESS_ID_PLACEHOLDER,
  CHAT_ID_PLACEHOLDER_C,
  CHAT_ID_PLACEHOLDER,
  MESSAGING_TYPE_PLACEHOLDER,
  MESSAGING_TYPE_PLACEHOLDER_C,
} from './const';
import {
  ChatDeleteHttpRequestDto,
  MessagingInFolderHttpResponseDto,
  ChatPermissionUpdateHttpRequestDto,
} from '../dto';
import { EventOriginEnum, ExcludeMemberTypeEnum } from '../../message';
import { MessagingHttpResponseDto } from '../../message/dto';
import { messagingToResponseDto } from '../../message/transformers';
import { VoteCodes } from '../../message/const';
import { BusinessLocalDocument, UserDocument } from '../../projections/models';
import { UsersService } from '../../projections';
import { PermissionsService } from '../../message/services/permissions.service';
import { ChatDraftsMessageService, ChatDraftMessageDocument } from '../../message/submodules/draft-messages';
import { CustomerChat } from '../../message/submodules/messaging/customer-chat';
import { MessagingTypeEnum } from '@pe/message-kit';

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/messaging`)
@ApiTags('messaging')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin, RolesEnum.merchant, RolesEnum.user)
export class MessagingController extends AbstractController {
  constructor(
    private readonly commonMessagingService: CommonMessagingService,
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
    private readonly chatDraftMessagesService: ChatDraftsMessageService,
    private readonly chatMessageService: ChatMessageService,
  ) {
    super();
  }

  @Get()
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, type: [MessagingInFolderHttpResponseDto] })
  @ApiParam({ name: 'page', type: Number })
  @ApiParam({ name: 'limit', type: Number })
  public async findAll(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName, false) business: BusinessLocalDocument,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Query() query: FastifyRequestLocal['query'],
    @Query('allBusiness') allBusiness: boolean,
    @Query('limitMessage') limitMessage: boolean,
  ): Promise<MessagingInFolderHttpResponseDto[]> {
    const queryFilter: FilterQuery<AbstractMessagingDocument> = JSON.parse(query.filter || '{}');
    const user: UserDocument = await this.usersService.findById(userToken.id);
    allBusiness = allBusiness || !business;
    const basicMessagingFilter: FilterQuery<AbstractMessagingDocument> =
      this.commonMessagingService.getMessagingFilter({
        businessIds: allBusiness ? user.businesses : [business._id],
        user,
        userToken,
      });

    // handle pagination
    const limit: number = Number(query.limit) || 50;
    const page: number = Number(query.page) || 1;
    const skip: number = (page - 1) * limit;

    const chats: AbstractMessagingDocument[] = await this.commonMessagingService.find({
      $and: [
        queryFilter,
        basicMessagingFilter,
        {
          type: { $ne: MessagingTypeEnum.AppChannel },
        },
      ],
      deleted: {
        $ne: true,
      },
    }).populate({
      path: 'members',
      populate: {
        path: 'user',
        select: 'userAccount',
      },
    })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    await Promise.all(chats.map((chat: AbstractMessagingDocument) =>
      this.commonMessagingService.fillCachedData(chat, user._id),
    ));

    await Promise.all(
      chats.filter((chat: AbstractMessaging) => CustomerChat.isTypeOf(chat))
        .map((chat: AbstractMessagingDocument) => chat.populate('contact').execPopulate()),
    );

    if (limitMessage) {
      for (const chat of chats) {
        if (chat.lastMessages.length > 1) {
          chat.lastMessages = [chat.lastMessages[(chat.lastMessages.length - 1)]];
        }
      }
    }

    const chatIds: string[] = chats.map((chat: AbstractMessagingDocument) => chat._id);
    const folderItems: EsFolderItemInterface[] = business ?
      await this.commonMessagingService.getBusinessFolderItems(chatIds, business._id) :
      await this.commonMessagingService.getUserFolderItems(chatIds, userToken.id);

    const decryptedChats: AbstractMessaging[] =
      await Promise.all(
        chats.map(
          (chat: AbstractMessagingDocument) => this.commonMessagingService.decryptChat(chat),
        ),
      );

    const chatsDto: MessagingHttpResponseDto[] = decryptedChats.map(
      (chat: AbstractMessaging) => messagingToResponseDto(chat, {
        forUser: userToken.id,
      }),
    );

    const chatDrafts: ChatDraftMessageDocument[] = await this.chatDraftMessagesService.find({
      chat: { $in: chatsDto.map((chat: MessagingHttpResponseDto) => chat._id) },
      sender: user.id,
    });

    await Promise.all(
      chatsDto.map((chat: MessagingHttpResponseDto) => this.chatMessageService.populateObjects(chat.messages)),
    );

    return chatsDto.map((chatDto: MessagingHttpResponseDto) => {
      const chatItemsInFolder: EsFolderItemInterface[] = folderItems.filter(
        (item: EsFolderItemInterface) => item.serviceEntityId === chatDto._id,
      );

      return {
        ...chatDto,
        draft: chatDrafts.find((draft: ChatDraftMessageDocument) => draft.chat === chatDto._id),
        locations: chatItemsInFolder.map((chatItemInFolder: EsFolderItemInterface) => ({
          _id: chatItemInFolder._id,
          folderId: chatItemInFolder.parentFolderId,
        })),
      };
    });
  }

  @ApiResponse({ status: HttpStatus.OK, type: [MessagingHttpResponseDto] })
  @Get(`${MESSAGING_TYPE_PLACEHOLDER_C}/${CHAT_ID_PLACEHOLDER_C}`)
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  public async findById(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessLocalDocument,
    @Param(BUSINESS_ID_PLACEHOLDER) businessId: string,
    @Param(MESSAGING_TYPE_PLACEHOLDER) type: MessagingTypeEnum,
    @Param(CHAT_ID_PLACEHOLDER) chatId: string,
  ): Promise<MessagingHttpResponseDto> {
    const user: UserDocument = await this.usersService.findById(userToken.id);
    const basicMessagingFilter: FilterQuery<AbstractMessagingDocument> =
      this.commonMessagingService.getMessagingFilter({
        business,
        user,
        userToken,
      });
    const chatFilter: FilterQuery<AbstractMessagingDocument> = {
      $and: [{
        _id: chatId,
        type: type,
      }, basicMessagingFilter],
    };
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findOne(chatFilter);
    if (!chat) {
      throw new NotFoundException(`Chat by ${JSON.stringify(chatFilter, null, 2)}`);
    }
    await this.denyAccessUnlessGranted(VoteCodes.READ_MESSAGING, chat, { userToken });
    if (CustomerChat.isTypeOf(chat)) {
      await chat.populate('contact').execPopulate();
    }

    await this.commonMessagingService.fillCachedData(chat, user._id);
    const messaging: AbstractMessaging = await this.commonMessagingService.decryptChat(chat);

    await this.chatMessageService.populateObjects(messaging.lastMessages);

    return messagingToResponseDto(messaging, {
      forUser: userToken.id,
    });
  }

  @Delete(`${MESSAGING_TYPE_PLACEHOLDER_C}/${CHAT_ID_PLACEHOLDER_C}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Acl({ microservice: 'message', action: AclActionsEnum.delete })
  public async delete(
    @User() userToken: UserTokenInterface,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
      type: MESSAGING_TYPE_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerGroupId: string,
    @Body() dto: ChatDeleteHttpRequestDto,
  ): Promise<void> {
    if (!('deleteForEveryone' in dto) || dto.deleteForEveryone) {
      await this.denyAccessUnlessGranted(
        VoteCodes.DELETE_MESSAGING,
        chat,
        { userToken },
        `You have no permission to delete chat`,
      );
      await this.commonMessagingService.delete(chat._id, EventOriginEnum.MerchantHttpServer);
    } else {
      //  deprecated branch
      const userToExclude: UserDocument = await this.usersService.findById(userToken.id);
      if (!userToExclude) {
        throw new NotFoundException(`User by _id "${userToken.id}" not found`);
      }
      await this.denyAccessUnlessGranted(
        VoteCodes.EXCLUDE_MEMBER,
        chat,
        { userToken, userToExclude },
        `You have no permission to exclude from "${chat._id}"`,
      );
      await this.commonMessagingService.purgeMember(chat, userToExclude);
    }
  }

  @Post(`${MESSAGING_TYPE_PLACEHOLDER_C}/${CHAT_ID_PLACEHOLDER_C}/leave`)
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.user)
  public async leave(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName, false) business: BusinessModel,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
      type: MESSAGING_TYPE_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @User() userToken: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(
      VoteCodes.LEAVE_MESSAGING,
      chat,
      { userToken },
      `You can not leave the chat "${chat._id}"`,
    );
    await this.commonMessagingService.excludeMemberFromChat(chat, userToken.id, ExcludeMemberTypeEnum.left);
  }

  @ApiResponse({ status: 200, type: MessagingHttpResponseDto })
  @Post(`${MESSAGING_TYPE_PLACEHOLDER_C}/${CHAT_ID_PLACEHOLDER_C}/permissions`)
  @HttpCode(HttpStatus.OK)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async updateGroupPermissions(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
      type: MESSAGING_TYPE_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerGroupId: string,
    @Body() dto: ChatPermissionUpdateHttpRequestDto,
  ): Promise<MessagingHttpResponseDto> {
    await this.denyAccessUnlessGranted(VoteCodes.CHANGE_PERMISSIONS,
      chat,
      userToken,
      `You can't change permissions for group chat "${chat._id}"`,
    );

    if (!AbstractMessaging.hasPermissions(chat)) {
      throw new BadRequestException(`${chat.type} doesn't have permissions`);
    }

    const updatedMessaging: AbstractMessagingDocument = await this.permissionsService.updateMessagingPermissions(
      chat,
      dto,
      EventOriginEnum.MerchantHttpServer,
    );

    return messagingToResponseDto(updatedMessaging, {
      forUser: userToken.id,
    });
  }
}
