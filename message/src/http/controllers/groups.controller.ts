import { v4 as uuid } from 'uuid';
import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
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
  GroupCreateHttpRequestDto,
  GroupUpdateHttpRequestDto,
  MemberHttpRequestDto,
} from '../dto';
import {
  GroupChatService,
  GroupChatDocument,
} from '../../message/submodules/messaging/group-chats';
import {
  AbstractMessaging,
  CommonMessagingService,
  ChatMember,
} from '../../message/submodules/platform';
import {
  EventOriginEnum,
  AddMemberMethodEnum,
} from '../../message';
import {
  GroupChatHttpResponseDto,
} from '../../message/dto';
import {

  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  BUSINESS_ID_PLACEHOLDER,
  GROUP_ID_PLACEHOLDER_C,
  GROUP_ID_PLACEHOLDER,

} from './const';

import { groupChatToResponseDto } from '../../message/transformers';
import { VoteCodes } from '../../message/const';

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/messaging/group`)
@ApiTags('messaging/group-chats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin, RolesEnum.merchant)
export class GroupsController extends AbstractController {
  constructor(
    private readonly groupChatService: GroupChatService,
    private readonly commonMessagingService: CommonMessagingService,

  ) {
    super();
  }

  @Post()
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  @ApiResponse({ status: 201, type: GroupChatHttpResponseDto })
  public async createGroup(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Body() dto: GroupCreateHttpRequestDto,
    @User() userToken: UserTokenInterface,
  ): Promise<GroupChatHttpResponseDto> {
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_MESSAGING,
      business,
      {
        userToken,
      },
      `You have no permission to create ${MessagingTypeEnum.Group}`,
    );
    const members: ChatMember[] = (dto.members || []).map((memberPrototype: MemberHttpRequestDto) => ({
      addMethod: AddMemberMethodEnum.INITIAL,
      addedBy: userToken.id,
      role: memberPrototype.role || ChatMemberRoleEnum.Member,
      user: memberPrototype.user,
    }));
    const newGroupChat: GroupChatDocument = await this.groupChatService.create({
      ...dto,

      _id: uuid(),
      business: business._id,
      deleted: false,
      expiresAt: null,

      lastMessages: [],
      members: [{
        addMethod: AddMemberMethodEnum.OWNER,
        addedBy: userToken.id,
        role: ChatMemberRoleEnum.Admin,
        user: userToken.id,
      }, ...members],
      salt: this.commonMessagingService.createSalt(),
      type: MessagingTypeEnum.Group,
    }, EventOriginEnum.MerchantHttpServer);

    return groupChatToResponseDto(newGroupChat);
  }

  @ApiResponse({ status: 200, type: GroupChatHttpResponseDto })
  @Patch(GROUP_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async updateGroup(
    @User() userToken: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: GROUP_ID_PLACEHOLDER_C,
      business: BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
      type: `=${MessagingTypeEnum.Group}`,
    }, AbstractMessaging.name, true) chat: GroupChatDocument,
    @Param(GROUP_ID_PLACEHOLDER) swaggerGroupId: string,
    @Body() dto: GroupUpdateHttpRequestDto,
  ): Promise<GroupChatHttpResponseDto> {
    await this.denyAccessUnlessGranted(
      VoteCodes.UPDATE_MESSAGING,
      chat, { userToken }, `You can't update group "${chat._id}"`,
    );

    const updatedGroupChat: GroupChatDocument = await this.groupChatService.update({
      ...dto,
      _id: chat._id,
    }, EventOriginEnum.MerchantHttpServer);

    return groupChatToResponseDto(updatedGroupChat);
  }
}
