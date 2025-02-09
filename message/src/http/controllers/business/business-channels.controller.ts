import { v4 as uuid } from 'uuid';
import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpStatus,
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
  Acl,
  AclActionsEnum,
} from '@pe/nest-kit';
import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';

import {
  ChatMemberRoleEnum,
  MessagingTypeEnum,
} from '@pe/message-kit';
import {
  ChannelUpdateHttpRequestDto,
  CommonChannelCreateDto,
} from '../../dto';
import {
  EventOriginEnum,
  ChannelTypeEnum,
  AddMemberMethodEnum,
} from '../../../message';
import {
  CommonChannelHttpResponseDto,
} from '../../../message/dto';
import {
  AbstractMessagingDocument,
  AbstractMessaging,
  CommonMessagingService,
} from '../../../message/submodules/platform';
import {
  CommonChannelDocument,
  CommonChannelService,
} from '../../../message/submodules/messaging/common-channels';

import {
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  BUSINESS_ID_PLACEHOLDER,
  CHANNEL_ID_PLACEHOLDER_C,
  CHANNEL_ID_PLACEHOLDER,
  ALL_CHANNEL_MESSAGING_TYPES,
} from '../const';
import { commonChannelToResponseDto } from '../../../message/transformers';
import { VoteCodes } from '../../../message/const';
import { LeanDocument } from 'mongoose';

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/messaging/channel`)
@ApiTags('messaging/common-channels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin, RolesEnum.merchant)
export class BusinessChannelsController extends AbstractController {
  constructor(
    private readonly commonChannelService: CommonChannelService,
    private readonly commonMessagingService: CommonMessagingService,
  ) {
    super();
  }
  @ApiResponse({ status: HttpStatus.OK, type: CommonChannelHttpResponseDto })
  @Post()
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async createBusinessCommonChannel(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Body() dto: CommonChannelCreateDto,
    @User() userToken: UserTokenInterface,
  ): Promise<CommonChannelHttpResponseDto> {
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_MESSAGING,
      business,
      {
        userToken,
      },
      `You have no permission to create ${MessagingTypeEnum.Channel}`,
    );
    const newChannel: CommonChannelDocument = await this.commonChannelService.create({
      business: business._id,
      description: '',
      lastMessages: [],
      members: [{
        addMethod: AddMemberMethodEnum.OWNER,
        addedBy: userToken.id,
        role: ChatMemberRoleEnum.Admin,
        user: userToken.id,
      }],
      photo: '',
      salt: this.commonMessagingService.createSalt(),
      signed: false,
      subType: ChannelTypeEnum.Private,
      usedInWidget: false,
      ...dto,
      _id: uuid(),
      permissions: {
        addMembers: true,
        change: true,
        live: false,
        pinMessages: true,
        sendMedia: true,
        sendMessages: true,
        showSender: true,
      } as LeanDocument<CommonChannelDocument['permissions']>,
      type: MessagingTypeEnum.Channel,
    }, EventOriginEnum.MerchantHttpServer);


    return commonChannelToResponseDto(newChannel);
  }

  @ApiResponse({ status: HttpStatus.OK, type: [CommonChannelHttpResponseDto] })
  @Patch(CHANNEL_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async updateChannel(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel<AbstractMessagingDocument>({
      _id: CHANNEL_ID_PLACEHOLDER_C,
      business: BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
      type: { $in: ALL_CHANNEL_MESSAGING_TYPES },
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CHANNEL_ID_PLACEHOLDER) swaggerChannelId: string,
    @Body() dto: ChannelUpdateHttpRequestDto,
    @User() userToken: UserTokenInterface,
  ): Promise<CommonChannelHttpResponseDto> {
    await this.denyAccessUnlessGranted(
      VoteCodes.UPDATE_MESSAGING,
      chat,
      {
        userToken,
      },
      `You have no permission to update ${chat.type}`,
    );
    const updatedChannel: CommonChannelDocument = await this.commonChannelService.update({
      ...dto,
      _id: chat._id,
    }, EventOriginEnum.MerchantHttpServer);

    return commonChannelToResponseDto(updatedChannel);
  }
}
