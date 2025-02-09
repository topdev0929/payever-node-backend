import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, Acl, AclActionsEnum, ParamModel, QueryDto } from '@pe/nest-kit';
import { AccessTokenPayload, JwtAuthGuard, Roles, RolesEnum, User } from '@pe/nest-kit/modules/auth';
import {
  AttributeFilterDto,
  GetSubscriptionMediaWithFilterDto,
  PaginationDto,
  SearchMediaDto,
  SubscriptionMediaListDto,
} from '../dto';
import { SubscriptionMediaModel } from '../models';
import { SubscriptionMediaSchemaName } from '../schemas';
import { AttributeService, SubscriptionMediaService } from '../services';
import { UserSubscriptionMediaReadVoter } from '../voters';
import { ElasticService } from '../services/elastic.service';

@Controller(':businessId/subscription')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiTags('User Subscription API')
export class UserSubscriptionMediaController extends AbstractController{
  constructor(
    private readonly attributeService: AttributeService,
    private readonly subscriptionMediaService: SubscriptionMediaService,
    private readonly elasticService: ElasticService,
  ) {
    super();
  }

  @Get()
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getSubscribedMedia(
    @Query() pagination: PaginationDto,
    @User() user: AccessTokenPayload,
  ): Promise<SubscriptionMediaModel[]> {
    return this.subscriptionMediaService.findSubscriptionMediaByUserId(user.id, pagination);
  }

  @Get('/folder/:folderId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getSubscribedMediaByFolder(
    @Query() pagination: PaginationDto,
    @User() user: AccessTokenPayload,
    @Param('folderId') folderId: string,
  ): Promise<SubscriptionMediaModel[]> {
    return this.subscriptionMediaService.findSubscriptionMediaByUserId(
      user.id,
      pagination,
      null,
      null,
    );
  }

  @Get('/search')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async search(
    @Query() search: SearchMediaDto,
    @User() user: AccessTokenPayload,
  ): Promise<SubscriptionMediaModel[]> {

    return this.subscriptionMediaService.searchMediaByUserId(user.id, search);
  }

  @Get('/by-attribute')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findByGETMultipleAttributes(
    @QueryDto() dto: GetSubscriptionMediaWithFilterDto,
  ): Promise<SubscriptionMediaListDto> {
    return this.elasticService.findByGetMultipleAttributes(dto);
  }

  @Post('/by-attribute')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findByMultipleAttributes(
    @Query() pagination: PaginationDto,
    @Body() attributeFilter: AttributeFilterDto,
  ): Promise<SubscriptionMediaModel[]> {
    return this.subscriptionMediaService.findByMultipleAttributes(pagination, attributeFilter);
  }

  @Get('/:subscriptionMediaId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findSubscriptionMediaById(
    @User() user: AccessTokenPayload,
    @ParamModel('subscriptionMediaId', SubscriptionMediaSchemaName) subscriptionMedia: SubscriptionMediaModel,
  ): Promise<SubscriptionMediaModel> {
    await this.denyAccessUnlessGranted(UserSubscriptionMediaReadVoter.READ, subscriptionMedia, user);
    
    return subscriptionMedia
    .populate({
      path: 'attributes.attribute',
      select: 'icon name type',
    }).execPopulate();
  }

  @Get('/by-attribute/:attributeId/:attributeValue')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findByAttribute(
    @Query() pagination: PaginationDto,
    @User() user: AccessTokenPayload,
    @Param('attributeId') attributeId: string,
    @Param('attributeValue') attributeValue: string,
  ): Promise<SubscriptionMediaModel[]> {

    return this.subscriptionMediaService.findSubscriptionMediaByUserId(
      user.id,
      pagination,
      attributeId,
      attributeValue,
    );
  }
}
