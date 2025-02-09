import { v4 as uuid } from 'uuid';
import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  Inject,
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

import { ChatMemberRoleEnum, MessagingTypeEnum } from '@pe/message-kit';
import { ChannelUpdateHttpRequestDto, CommonChannelCreateDto } from '../../dto';
import {
  EventOriginEnum,
  ChannelTypeEnum,
  AddMemberMethodEnum,
} from '../../../message';
import { CommonChannelHttpResponseDto } from '../../../message/dto';
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
  CHANNEL_ID_PLACEHOLDER_C,
  CHANNEL_ID_PLACEHOLDER,
  ALL_CHANNEL_MESSAGING_TYPES,
} from '../const';
import { commonChannelToResponseDto } from '../../../message/transformers';
import { VoteCodes } from '../../../message/const';
import { LeanDocument } from 'mongoose';

@Controller(`messaging/channels`)
@ApiTags('personal/messaging/common-channels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.user)
export class PersonalChannelsController extends AbstractController {
  @Inject() private readonly commonChannelService: CommonChannelService;
  @Inject() private readonly commonMessagingService: CommonMessagingService;

  @ApiResponse({ status: HttpStatus.OK, type: CommonChannelHttpResponseDto })
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  @Post()
  public async createCommonChannel(
    @Body() dto: CommonChannelCreateDto,
    @User() userToken: UserTokenInterface,
  ): Promise<CommonChannelHttpResponseDto> {
    const newChannel: CommonChannelDocument = await this.commonChannelService.create({
      business: null,
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

  @ApiResponse({ status: HttpStatus.OK, type: CommonChannelHttpResponseDto })
  @Patch(CHANNEL_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async updateChannel(
    @ParamModel<AbstractMessagingDocument>({
      _id: CHANNEL_ID_PLACEHOLDER_C,
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
