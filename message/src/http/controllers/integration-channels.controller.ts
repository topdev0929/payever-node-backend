// tslint:disable: object-literal-sort-keys
import { v4 as uuid } from 'uuid';
import {
  Controller,
  Inject,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import {
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  User,
  UserTokenInterface,
  AclActionsEnum,
  Roles,
  Acl,
  AbstractController,
} from '@pe/nest-kit';
import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';
import {
  MessagingTypeEnum,
  ChatMemberRoleEnum,
  MessagingIntegrationsEnum,
} from '@pe/message-kit';

import {
  IntegrationChannelCreateDto,
  IntegrationChannelUpdateDto,
} from '../dto';
import {
  EventOriginEnum,
  AddMemberMethodEnum,
  ChannelTypeEnum,
} from '../../message';
import {
  IntegrationChannelHttpResponseDto,
} from '../../message/dto';
import {
  AbstractMessaging,
  ChatMessageService,
  AbstractChatMessage,
  AbstractChatMessageDocument,
  CommonMessagingService,
} from '../../message/submodules/platform';
import {
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  BUSINESS_ID_PLACEHOLDER,
  CHANNEL_ID_PLACEHOLDER_C,
  CHANNEL_ID_PLACEHOLDER,
} from './const';
import {
  integrationChannelToResponseDto,
} from '../../message/transformers';
import { VoteCodes } from '../../message/const';
import {
  CommonChannelService,
  CommonChannelDocument,
  CommonChannel,
} from '../../message/submodules/messaging/common-channels';
import { LeanDocument } from 'mongoose';

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}`)
@ApiTags('messaging/integration-channel')
export class IntegrationChannelsController extends AbstractController {
  @Inject() private readonly commonMessagingService: CommonMessagingService;
  @Inject() private readonly chatMessageService: ChatMessageService;
  @Inject() private readonly commonChannelService: CommonChannelService;

  @ApiResponse({ status: HttpStatus.OK, type: IntegrationChannelHttpResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.admin, RolesEnum.merchant)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  @Post(`/messaging/integration-channel`)
  public async createIntegrationChannel(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Body() dto: IntegrationChannelCreateDto,
    @User() userToken: UserTokenInterface,
  ): Promise<IntegrationChannelHttpResponseDto> {
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_MESSAGING,
      business,
      {
        userToken,
      },
      `You have no permission to create ${MessagingTypeEnum.Channel}`,
    );
    const newIntegrationChannel: CommonChannelDocument = await this.commonChannelService.create({
      _id: uuid(),
      description: '',
      lastMessages: [],
      photo: '',
      usedInWidget: false,
      ...dto,
      business: business._id,
      deleted: false,
      expiresAt: null,
      members: [{
        addMethod: AddMemberMethodEnum.OWNER,
        addedBy: userToken.id,
        role: ChatMemberRoleEnum.Admin,
        user: userToken.id,
      }],
      salt: this.commonMessagingService.createSalt(),
      signed: false,
      type: MessagingTypeEnum.Channel,

      contacts: [],
      integrationName: MessagingIntegrationsEnum.Internal,
      subType: ChannelTypeEnum.Private,
      permissions: {
        addMembers: true,
        change: true,
        pinMessages: true,
        sendMedia: true,
        sendMessages: true,
        showSender: true,
        live: false,
      } as LeanDocument<CommonChannelDocument['permissions']>,
    }, EventOriginEnum.MerchantHttpServer);

    return integrationChannelToResponseDto(newIntegrationChannel);
  }

  @ApiResponse({ status: HttpStatus.OK, type: IntegrationChannelHttpResponseDto})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.admin, RolesEnum.merchant)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  @Patch(`/messaging/integration-channel/${CHANNEL_ID_PLACEHOLDER_C}`)
  public async updateIntegrationChannel(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel<CommonChannelDocument>({
      _id: CHANNEL_ID_PLACEHOLDER_C,
      business: BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
      deleted: { $ne: true },
      type: { $eq: MessagingTypeEnum.Channel },
    }, AbstractMessaging.name, true) chat: CommonChannelDocument,
    @Param(CHANNEL_ID_PLACEHOLDER) swaggerChannelId: string,
    @Body() dto: IntegrationChannelUpdateDto,
    @User() userToken: UserTokenInterface,
  ): Promise<IntegrationChannelHttpResponseDto> {
    await this.denyAccessUnlessGranted(
      VoteCodes.UPDATE_MESSAGING,
      chat,
      {
        userToken,
      },
      `You have no permission to update ${chat.type}`,
    );
    const updatedIntegrationChannel: CommonChannelDocument = await this.commonChannelService.update({
      _id: chat._id,
      ...dto,
    }, EventOriginEnum.MerchantHttpServer);

    return integrationChannelToResponseDto(updatedIntegrationChannel);
  }

  @Get(`integration-channels/${CHANNEL_ID_PLACEHOLDER_C}`)
  @ApiResponse({ status: 200, type: IntegrationChannelHttpResponseDto })
  public async findChannelById(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel<CommonChannelDocument>({
      _id: CHANNEL_ID_PLACEHOLDER_C,
      business: BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
      deleted: { $ne: true },
      type: { $eq: MessagingTypeEnum.Channel },
    }, AbstractMessaging.name, true) integrationChannel: CommonChannelDocument,
    @Param(CHANNEL_ID_PLACEHOLDER) swaggerChannelId: string,
  ): Promise<IntegrationChannelHttpResponseDto> {
    const decryptedChannel: CommonChannel =
      await this.commonMessagingService.decryptChat(integrationChannel);

    //  TODO: Instead of fetching all messages from messages collection
    //  we could increase last messages array cache
    //  and add method to get old messages
    const messages: AbstractChatMessageDocument[] = await this.chatMessageService.find({
      chat: integrationChannel._id,
    }).sort({
      createdAt: -1,
    });

    messages.reverse();

    const decryptedMessages: AbstractChatMessage[] =
      await this.commonMessagingService.decryptMessagesWithSalt(messages, integrationChannel.salt);

    return integrationChannelToResponseDto({
      ...decryptedChannel,
      lastMessages: decryptedMessages,
    }, {
      forUser: null,
    });
  }
}
