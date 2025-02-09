import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import { FilterQuery, LeanDocument } from 'mongoose';

import {
  ChatMessageTemplateCreateHttpRequestDto,
  ChatMessageTemplateUpdateHttpRequestDto,
} from '../../dto';
import {
  ChatMessageTemplateDocument,
  ChatMessageTemplateService,
  ChatMessageTemplateSchemaName,
  ChatTemplateDocument,
  ChatTemplateSchemaName,
} from '../../../message/submodules/templates';
import { FastifyRequestLocal } from '../../interfaces';
import {
  CHAT_TEMPLATE_ID_PLACEHOLDER_C,
  CHAT_TEMPLATE_ID_PLACEHOLDER,
  CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER_C,
  CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER,
} from './const';
import { EventOriginEnum } from '../../../message';

@Controller(`admin/chat-templates/${CHAT_TEMPLATE_ID_PLACEHOLDER_C}/messages`)
@ApiTags('admin/message-templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class ChatMessageTemplatesController {
  constructor(
    private readonly chatMessageTemplateService: ChatMessageTemplateService,
  ) { }

  @Post()
  public async createChatMessageTemplate(
    @ParamModel({
      _id: CHAT_TEMPLATE_ID_PLACEHOLDER_C,
    }, ChatTemplateSchemaName) chatTemplate: ChatTemplateDocument,
    @Param(CHAT_TEMPLATE_ID_PLACEHOLDER) swaggerChatTemplateId: string,
    @Body() dto: ChatMessageTemplateCreateHttpRequestDto,
    @User() user: UserTokenInterface,
  ): Promise<ChatMessageTemplateDocument> {
    return this.chatMessageTemplateService.create({
      ...dto,
      chatTemplate: chatTemplate._id,
      sender: user.id,
    }, EventOriginEnum.MerchantHttpServer);
  }

  @Get()
  public async findAllChatMessageTemplates(
    @ParamModel({
      _id: CHAT_TEMPLATE_ID_PLACEHOLDER_C,
    }, ChatTemplateSchemaName) chatTemplate: ChatTemplateDocument,
    @Param(CHAT_TEMPLATE_ID_PLACEHOLDER) swaggerChatTemplateId: string,
    @Query() query: FastifyRequestLocal['query'],
  ): Promise<Array<LeanDocument<ChatMessageTemplateDocument>>> {
    const filter: FilterQuery<ChatMessageTemplateDocument> = JSON.parse(query.filter || '{}');

    return this.chatMessageTemplateService.find({
      ...filter,
      chatTemplate: chatTemplate._id,
    });
  }

  @Get(CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER_C)
  public async findChatMessageTemplateById(
    @Param(CHAT_TEMPLATE_ID_PLACEHOLDER) swaggerChatTemplateId: string,
    @ParamModel({
      _id: CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER_C,
    }, ChatMessageTemplateSchemaName, true) chatMessageTemplate: ChatMessageTemplateDocument,
    @Param(CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER) swaggerChatMessageId: string,
  ): Promise<LeanDocument<ChatMessageTemplateDocument>> {
    return chatMessageTemplate;
  }

  @Patch(CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER_C)
  public async updateChatMessageTemplate(
    @Param(CHAT_TEMPLATE_ID_PLACEHOLDER) swaggerChatTemplateId: string,
    @ParamModel({
      _id: CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER_C,
    }, ChatMessageTemplateSchemaName, true) chatMessageTemplate: ChatMessageTemplateDocument,
    @Param(CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER) swaggerChatMessageId: string,
    @Body() dto: ChatMessageTemplateUpdateHttpRequestDto,
  ): Promise<ChatMessageTemplateDocument> {
    return this.chatMessageTemplateService.update({
      ...dto,
      _id: chatMessageTemplate._id,
    }, EventOriginEnum.MerchantHttpServer);
  }

  @Delete(CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER_C)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteChatMessageTemplate(
    @Param(CHAT_TEMPLATE_ID_PLACEHOLDER) swaggerChatTemplateId: string,
    @ParamModel({
      _id: CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER_C,
    }, ChatMessageTemplateSchemaName, true) chatMessageTemplate: ChatMessageTemplateDocument,
    @Param(CHAT_MESSAGE_TEMPLATE_ID_PLACEHOLDER) swaggerChatMessageId: string,
  ): Promise<void> {
    await this.chatMessageTemplateService.delete(chatMessageTemplate._id, EventOriginEnum.MerchantHttpServer);
  }
}
