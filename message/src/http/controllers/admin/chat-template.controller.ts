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
import { MessagingTypeEnum } from '@pe/message-kit';
import { FilterQuery, LeanDocument } from 'mongoose';

import {
  ChatTemplateCreateHttpRequestDto,
  ChatTemplateUpdateHttpRequestDto,
} from '../../dto';
import {
  ChatTemplateDocument,
  ChatTemplateService,
  ChatTemplateSchemaName,
} from '../../../message/submodules/templates';
import { FastifyRequestLocal } from '../../interfaces';
import {
  CHAT_TEMPLATE_ID_PLACEHOLDER_C,
  CHAT_TEMPLATE_ID_PLACEHOLDER,
} from './const';
import { EventOriginEnum } from '../../../message';

@Controller(`admin/chat-templates`)
@ApiTags('admin/chat-templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class ChatTemplatesController {
  constructor(
    private readonly chatTemplateService: ChatTemplateService,
  ) { }

  @Post()
  public async createChatTemplate(
    @Body() dto: ChatTemplateCreateHttpRequestDto,
    @User() user: UserTokenInterface,
  ): Promise<ChatTemplateDocument> {
    return this.chatTemplateService.create(
      {
        type: MessagingTypeEnum.AppChannel,
        ...dto,
      },
      EventOriginEnum.MerchantHttpServer,
    );
  }

  @Get()
  public async findAllChatTemplates(
    @Query() query: FastifyRequestLocal['query'],
  ): Promise<Array<LeanDocument<ChatTemplateDocument>>> {
    const filter: FilterQuery<ChatTemplateDocument> = JSON.parse(query.filter || '{}');

    return this.chatTemplateService.find({
      ...filter,
    });
  }

  @Get(CHAT_TEMPLATE_ID_PLACEHOLDER_C)
  public async findChatTemplateById(
    @ParamModel({
      _id: CHAT_TEMPLATE_ID_PLACEHOLDER_C,
    }, ChatTemplateSchemaName, true) chatTemplate: ChatTemplateDocument,
    @Param(CHAT_TEMPLATE_ID_PLACEHOLDER) swaggerChatTemplateId: string,
  ): Promise<LeanDocument<ChatTemplateDocument>> {
    return chatTemplate;
  }

  @Patch(CHAT_TEMPLATE_ID_PLACEHOLDER_C)
  public async updateChatTemplate(
    @ParamModel({
      _id: CHAT_TEMPLATE_ID_PLACEHOLDER_C,
    }, ChatTemplateSchemaName, true) chatTemplate: ChatTemplateDocument,
    @Param(CHAT_TEMPLATE_ID_PLACEHOLDER) swaggerChatTemplateId: string,
    @Body() dto: ChatTemplateUpdateHttpRequestDto,
  ): Promise<ChatTemplateDocument> {
    return this.chatTemplateService.update({
      ...dto,
      _id: chatTemplate._id,
    }, EventOriginEnum.MerchantHttpServer);
  }

  @Delete(CHAT_TEMPLATE_ID_PLACEHOLDER_C)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteChatTemplate(
    @ParamModel({
      _id: CHAT_TEMPLATE_ID_PLACEHOLDER_C,
    }, ChatTemplateSchemaName, true) chatTemplate: ChatTemplateDocument,
    @Param(CHAT_TEMPLATE_ID_PLACEHOLDER) swaggerChatTemplateId: string,
  ): Promise<void> {
    await this.chatTemplateService.delete(chatTemplate._id, EventOriginEnum.MerchantHttpServer);
  }
}
