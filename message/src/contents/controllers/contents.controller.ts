// tslint:disable: no-duplicate-string
import {
  Controller,
  Get,
  Body,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
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
  Acl,
  AclActionsEnum,
} from '@pe/nest-kit';
import { DocumentDefinition } from 'mongoose';
import { BusinessLocalDocument as BusinessModel } from '../../projections/models';
import { BusinessSchemaName } from '@pe/business-kit';
import {
  BUSINESS_ID_PLACEHOLDER_C,
  BUSINESS_ID_PLACEHOLDER,
  CONTENT_ID_PLACEHOLDER_C,
  CONTENT_ID_PLACEHOLDER,
} from './const';
import { ContentModelDto, ContentSelectModelDto, CreateContentDto, UpdateContentDto } from '../dto';
import { ContentModel } from '../models';
import { ContentService } from '../services';
import { ContentSchemaName } from '../schemas';

@Controller('business/:businessId/contents')
@ApiTags('contents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class ContentsController {
  constructor(
    private readonly contentService: ContentService,
  ) { }

  @Get()
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  @ApiResponse({ status: 200, isArray: true, type: ContentModelDto })
  public async findAllContents(
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
  ): Promise<ContentModel[]> {
    return this.contentService.findAll(swaggerBusinessId);
  }

  @Post()
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async createContent(
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Body() dto: CreateContentDto,
  ): Promise<ContentModel> {
    return this.contentService.create(dto);
  }

  @Get(CONTENT_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  @ApiResponse({ status: 200, type: ContentModelDto })
  public async findContent(
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel(':contentId', ContentSchemaName) content: ContentModel,
    @Param(CONTENT_ID_PLACEHOLDER) swaggerContentId: string,
  ): Promise<ContentModel> {
    return content;
  }

  @Patch(CONTENT_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async updateContent(
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel(':contentId', ContentSchemaName) content: ContentModel,
    @Param(CONTENT_ID_PLACEHOLDER) swaggerContentId: string,
    @Body() dto: UpdateContentDto,
  ): Promise<ContentModel> {
    if (!content) {
      throw new NotFoundException('Bot not found');
    }

    return this.contentService.update(content, dto);
  }

  @Delete(CONTENT_ID_PLACEHOLDER_C)
  @Acl({ microservice: 'message', action: AclActionsEnum.delete })
  public async deleteContent(
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel(':contentId', ContentSchemaName) content: ContentModel,
    @Param(CONTENT_ID_PLACEHOLDER) swaggerContentId: string,
  ): Promise<void> {
    if (!content) {
      throw new NotFoundException('Bot not found');
    }

    return this.contentService.remove(content);
  }

  @Post(`${CONTENT_ID_PLACEHOLDER_C}/select`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  @ApiResponse({ status: 200, type: ContentSelectModelDto })
  public async selectContent(
    @ParamModel(BUSINESS_ID_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel(':contentId', ContentSchemaName, true) content: ContentModel,
    @Param(CONTENT_ID_PLACEHOLDER) swaggerContentId: string,
  ): Promise<DocumentDefinition<ContentModel> & { data?: any }> {
    return this.contentService.selectContent(business, content);
  }
}
