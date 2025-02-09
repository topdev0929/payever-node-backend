import {
  Controller,
  Param,
  UseGuards,
  Post,
  HttpCode,
  HttpStatus,
  Body,
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

import {
  AbstractMessagingDocument,
  CommonMessagingService,
  AbstractMessaging,
} from '../../message/submodules/platform';
import {
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  BUSINESS_ID_PLACEHOLDER,
  CONVERSATION_ID_PLACEHOLDER_C,
  CONVERSATION_ID_PLACEHOLDER,
} from './const';
import {
  DisableNotificationDto,
} from '../dto';
import { VoteCodes } from '../../message/const';

const MAX_TIMESTAMP: number = 8640000000000000;

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/conversations`)
@ApiTags('messaging/conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin, RolesEnum.merchant)
export class ConversationsController extends AbstractController {
  constructor(
    private readonly commonMessagingService: CommonMessagingService,
  ) {
    super();
  }

  @Post(`${CONVERSATION_ID_PLACEHOLDER_C}/notification/disable`)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  @ApiResponse({ status: HttpStatus.OK, type: null })
  @HttpCode(HttpStatus.OK)
  public async disableNotification(
    @User() user: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CONVERSATION_ID_PLACEHOLDER_C,
      business: BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CONVERSATION_ID_PLACEHOLDER) swaggerConversationId: string,
    @Body() dto: DisableNotificationDto,
    @User() userToken: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(
      VoteCodes.UPDATE_MESSAGING,
      chat,
      {
        userToken,
      },
      `You have no permission to update ${chat.type}`,
    );
    const until: Date = dto.forever ? new Date(MAX_TIMESTAMP) : dto.until;

    await this.commonMessagingService.updateMemberNotification(
      chat._id,
      user.id,
      until,
    );
  }

  @Post(`${CONVERSATION_ID_PLACEHOLDER_C}/notification/enable`)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  @ApiResponse({ status: HttpStatus.OK, type: null })
  @HttpCode(HttpStatus.OK)
  public async enableNotification(
    @User() user: UserTokenInterface,
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CONVERSATION_ID_PLACEHOLDER_C,
      business: BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
    }, AbstractMessaging.name, true) chat: AbstractMessagingDocument,
    @Param(CONVERSATION_ID_PLACEHOLDER) swaggerConversationId: string,
    @User() userToken: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(
      VoteCodes.UPDATE_MESSAGING,
      chat,
      {
        userToken,
      },
      `You have no permission to update ${chat.type}`,
    );
    await this.commonMessagingService.updateMemberNotification(
      chat._id,
      user.id,
      null,
    );
  }
}
