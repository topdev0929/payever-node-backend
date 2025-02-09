import { v4 as uuid } from 'uuid';
import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpStatus,
  BadRequestException,
  ConflictException,
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

import { ChatUpdateHttpRequestDto } from '../dto/chat-updated.dto';

import { ChatMemberRoleEnum, MessagingTypeEnum } from '@pe/message-kit';
import {
  CustomerChatCreateHttpRequestDto,
} from '../dto';
import {
  EventOriginEnum,
  AddMemberMethodEnum,
} from '../../message';
import {
  CustomerChatHttpResponseDto,
} from '../../message/dto';
import {
  CustomerChatService,
  CustomerChatDocument,
} from '../../message/submodules/messaging/customer-chat';
import {
  AbstractMessaging,
  CommonMessagingService,
} from '../../message/submodules/platform';
import {
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  BUSINESS_ID_PLACEHOLDER,
  CHAT_ID_PLACEHOLDER_C,
  CHAT_ID_PLACEHOLDER,
} from './const';
import { SubscriptionDocument } from '../../projections/models';
import { SubscriptionService } from '../../projections/services';
import { customerChatToResponseDto } from '../../message/transformers';
import { VoteCodes } from '../../message/const';

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/messaging/chat`)
@ApiTags('messaging/customer-chats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin, RolesEnum.merchant)
export class CustomerChatsController extends AbstractController {
  constructor(
    private readonly customerChatService: CustomerChatService,
    private readonly commonMessagingService: CommonMessagingService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    super();
  }

  @ApiResponse({ status: HttpStatus.OK, type: [CustomerChatHttpResponseDto] })
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  @Post()
  public async createCustomerChat(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Body() dto: CustomerChatCreateHttpRequestDto,
    @User() userToken: UserTokenInterface,
  ): Promise<CustomerChatHttpResponseDto> {
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_MESSAGING,
      business,
      {
        userToken,
      },
      `You have no permission to create ${MessagingTypeEnum.Channel}`,
    );
    const subscription: SubscriptionDocument =
      await this.subscriptionService.getSubscriptionByIntegrationCodeAndBusinessId({
        businessId: business._id,
        code: dto.integrationName,
      });
    if (!subscription || !subscription.installed || !subscription.enabled) {
      throw new BadRequestException(
        `Business "${business._id}" has no enabled integrations "${dto.integrationName}"`,
      );
    }

    const existingChat: CustomerChatDocument = await this.customerChatService.findOne({
      business: business._id,
      contact: dto.contact,
      deleted: {
        $ne: true,
      },
      integrationName: dto.integrationName,
    });

    if (existingChat) {
      throw new ConflictException(`Chat with contact '${dto.contact}' using '${dto.integrationName}' already`
        + ` exists: id = '${existingChat._id}', deleted = ${existingChat.deleted}`);
    }

    const tomorrow: Date = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const directChat: CustomerChatDocument = await this.customerChatService.create({
      lastMessages: [],
      ...dto,
      _id: uuid(),
      business: business._id,
      deleted: false,
      expiresAt: tomorrow,
      members: [{
        addMethod: AddMemberMethodEnum.OWNER,
        addedBy: userToken.id,
        role: ChatMemberRoleEnum.Admin,
        user: userToken.id,
      }],
      salt: this.commonMessagingService.createSalt(),
      type: MessagingTypeEnum.CustomerChat,
    }, EventOriginEnum.MerchantHttpServer);

    return customerChatToResponseDto(directChat);
  }

  @ApiResponse({ status: HttpStatus.OK, type: [CustomerChatHttpResponseDto] })
  @Patch(CHAT_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async updateCustomerChat(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      _id: CHAT_ID_PLACEHOLDER_C,
      business: BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
      type: `=${MessagingTypeEnum.CustomerChat}`,
    }, AbstractMessaging.name, true) chat: CustomerChatDocument,
    @Param(CHAT_ID_PLACEHOLDER) swaggerChatId: string,
    @Body() dto: ChatUpdateHttpRequestDto,
    @User() userToken: UserTokenInterface,
  ): Promise<CustomerChatHttpResponseDto> {
    await this.denyAccessUnlessGranted(
      VoteCodes.UPDATE_MESSAGING,
      chat,
      {
        userToken,
      },
      `You have no permission to update ${chat.type}`,
    );
    const updatedChat: CustomerChatDocument = await this.customerChatService.update({
      ...dto,
      _id: chat._id,
    }, EventOriginEnum.MerchantHttpServer);

    return customerChatToResponseDto(updatedChat);
  }
}
