import { Body, Controller, Delete, Get, Patch, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminCreateCollectionDto, CollectionQueryDto, UpdateCollectionDto } from '../dto';
import { CollectionModel } from '../models';
import { CollectionsService } from '../services';
import { AbstractController, JwtAuthGuard, ParamModel, QueryDto, Roles, RolesEnum } from '@pe/nest-kit';
import { CollectionSchemaName } from '../schemas';

const COLLECTION_ID: string = ':collectionId';

@Controller('admin/collections')
@ApiTags('admin collections')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin)
export class AdminCollectionsController extends AbstractController {
  constructor(
    private readonly collectionService: CollectionsService,
  ) {
    super();
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  public async getAll(    
    @QueryDto() query: CollectionQueryDto,
  ): Promise<any> {
    return this.collectionService.getForAdmin(query);
  }

  @Get(COLLECTION_ID)
  public async getById(
    @ParamModel(COLLECTION_ID, CollectionSchemaName) collection: CollectionModel,
  ): Promise<CollectionModel> {
    return collection;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() createCollectionDto: AdminCreateCollectionDto,    
  ): Promise<CollectionModel> {
    return this.collectionService.createForAdmin(createCollectionDto);
  }

  @Patch(COLLECTION_ID)
  @HttpCode(HttpStatus.OK)
  public async update(
    @ParamModel(COLLECTION_ID, CollectionSchemaName) collection: CollectionModel,
    @Body() updateCollectionDto: UpdateCollectionDto,    
  ): Promise<CollectionModel> {
    return this.collectionService.update(collection, updateCollectionDto);
  }

  @Delete(COLLECTION_ID)
  @HttpCode(HttpStatus.OK)
  public async delete(
    @ParamModel(COLLECTION_ID, CollectionSchemaName) collection: CollectionModel,    
  ): Promise<void> {
    return this.collectionService.delete(collection);
  }
}
