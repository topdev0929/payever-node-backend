import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CopyCollectionDto,
  CreateCollectionDto,
  DeleteCollectionsListDto,
  GetCollectionsListDto,
  GetPaginatedListQueryDto,
  PaginatedCollectionsListDto,
  UpdateCollectionDto,
} from '../dto';
import { CollectionModel } from '../models';
import { CollectionsService } from '../services';
import {
  AbstractController,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  QueryDto,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import { CollectionSchemaName } from '../schemas';
import { CollectionDeleteVoter } from '../voters';

@Controller('/collections/:businessId')
@ApiTags('collections')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class CollectionController extends AbstractController {
  constructor(
    private readonly collectionService: CollectionsService,
  ) {
    super();
  }

  @Get('')
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  public async list(
    @Param('businessId') businessId: string,
    @QueryDto() paginationQuery: GetPaginatedListQueryDto,
  ): Promise<PaginatedCollectionsListDto> {
    return this.collectionService.getPaginatedListForBusiness(businessId, paginationQuery);
  }

  @Get('/base')
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  public async getBase(
    @Param('businessId') businessId: string,
    @QueryDto() paginationQuery: GetPaginatedListQueryDto,
  ): Promise<PaginatedCollectionsListDto> {
    return this.collectionService.getByParentForBusiness(businessId, paginationQuery);
  }

  @Get('/parent/:parentId')
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  public async getByParent(
    @Param('businessId') businessId: string,
    @Param('parentId') parentId: string,
    @QueryDto() paginationQuery: GetPaginatedListQueryDto,
  ): Promise<PaginatedCollectionsListDto> {
    return this.collectionService.getByParentForBusiness(businessId, paginationQuery, parentId);
  }

  @Get('/ancestor/:ancestorId')
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  public async getByAncestor(
    @Param('businessId') businessId: string,
    @Param('ancestorId') ancestorId: string,
    @QueryDto() paginationQuery: GetPaginatedListQueryDto,
  ): Promise<PaginatedCollectionsListDto> {
    return this.collectionService.getByAncestorForBusiness(businessId, paginationQuery, ancestorId);
  }

  @Get('/active/:channelSetId')
  @Roles(RolesEnum.anonymous)
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  public async listActive(
    @QueryDto() queryDto: GetCollectionsListDto,
    @QueryDto() paginationQuery: GetPaginatedListQueryDto,
    @Param('businessId') businessId: string,
    @Param('channelSetId') channelSetId: string,
  ): Promise<PaginatedCollectionsListDto> {

    return this.collectionService.getPaginatedActiveList(
      queryDto,
      businessId,
      channelSetId,
      paginationQuery,
    );
  }

  @Post('')
  @Acl({ microservice: 'products', action: AclActionsEnum.create })
  public async create(
    @Body() createCollectionDto: CreateCollectionDto,
    @Param('businessId') businessId: string,
  ): Promise<CollectionModel> {
    return this.collectionService.create(createCollectionDto, businessId);
  }

  @Post('/copy')
  @Acl({ microservice: 'products', action: AclActionsEnum.create })
  public async copy(
    @Body() copyCollectionDto: CopyCollectionDto,
    @Param('businessId') businessId: string,
  ): Promise<PaginatedCollectionsListDto> {
    return this.collectionService.copy(copyCollectionDto, businessId);
  }

  @Get('/:collectionId')
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  public async get(
    @ParamModel(':collectionId', CollectionSchemaName) collection: CollectionModel,
    @Param('businessId') businessId: string,
  ): Promise<CollectionModel> {
    if (collection.businessId !== businessId) {
      throw new NotFoundException();
    }

    return collection;
  }

  @Patch('/:collectionId')
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async update(
    @ParamModel(':collectionId', CollectionSchemaName) collection: CollectionModel,
    @Body() updateCollectionDto: UpdateCollectionDto,
    @Param('businessId') businessId: string,
  ): Promise<CollectionModel> {
    if (collection.businessId !== businessId) {
      throw new ForbiddenException('Collection doesn\'t belong to business');
    }

    return this.collectionService.update(collection, updateCollectionDto);
  }

  @Delete('/:collectionId')
  @Acl({ microservice: 'products', action: AclActionsEnum.delete })
  public async delete(
    @ParamModel(':collectionId', CollectionSchemaName) collection: CollectionModel,
    @Param('businessId') businessId: string,
    @User() user: UserTokenInterface,
  ): Promise<void> {

    await this.denyAccessUnlessGranted(CollectionDeleteVoter.DELETE, collection, user);

    return this.collectionService.delete(collection);
  }

  @Delete('/list')
  @Acl({ microservice: 'products', action: AclActionsEnum.delete })
  public async deleteList(
    @Param('businessId') businessId: string,
    @Body() dto: DeleteCollectionsListDto,
    @User() user: UserTokenInterface,
  ): Promise<void> {
    const collections: CollectionModel[] = await this.collectionService.getListById(dto.ids);
    await this.denyAccessUnlessGranted(CollectionDeleteVoter.DELETE, collections, user);

    return this.collectionService.deleteList(collections);
  }
}
