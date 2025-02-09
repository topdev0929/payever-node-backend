import {
  BadRequestException, Controller, Delete, HttpCode, HttpStatus, InternalServerErrorException,
  Param, Post, Get, Query, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImageMimeTypes } from '../../tools/mime-types.enum';
import { BlobStorageService } from '../../storage/services';
import {
  BlobCreatedDto,
  FsFile,
  MediaItemModel,
  FilesStorage,
  BusinessMediaService,
  MediaItemService,
  FileQueryDto,
  MediaItemSchemaName,
} from '../../media';
import { UploadMediaWithBlobNameDto, ChangeContainerByApplicationDto, UploadMediaOptionsDto } from '../dto';
import { Files } from '../decorators';
import { MultipartService } from '../services';
import { ParamModel } from '@pe/nest-kit';

@Controller('admin/files')
@ApiTags('Admin Files')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminFilesController {
  constructor(
    private readonly storageService: BlobStorageService,
    private readonly businessMediaService: BusinessMediaService,
    private readonly multipartService: MultipartService,
    private readonly filesStorage: FilesStorage,
    private readonly mediaItemService: MediaItemService,
  ) { }
  @Get()
  public async getAll(
    @Query() query: FileQueryDto,
  ): Promise<any> {
    return this.mediaItemService.getForAdmin(query);
  }

  @Get(':fileId')
  public async getById(
    @ParamModel('fileId', MediaItemSchemaName, true) mediaItem: MediaItemModel,
  ): Promise<MediaItemModel> {
    return mediaItem;
  }

  @Get('container/:container/name/:name')
  public async getByContainerAndName(
    @ParamModel({ container: ':container', name: ':name' }, MediaItemSchemaName, true)
    mediaItem: MediaItemModel,
  ): Promise<MediaItemModel> {
    return mediaItem;
  }

  @Post('business/:businessId/container/:container/application/:applicationId')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created',
    status: HttpStatus.CREATED,
    type: BlobCreatedDto,
  })
  public async create(
    @Param() { container, businessId, applicationId }: ChangeContainerByApplicationDto,
    @Files({
      allowedMimeTypes: ImageMimeTypes,
      disableSanitizer: false,
      storeType: 'fs',
    }) files: FsFile[],
    @Query() options: UploadMediaOptionsDto,
  ): Promise<BlobCreatedDto | BlobCreatedDto[]> {
    return this.multipartService.handleFiles(
      files,
      this.filesStorage.storageFactory(
        this.businessMediaService,
        businessId,
        container,
        options.compress,
        applicationId,
        options.generateThumbnail,
      ),
    );
  }

  @Delete('business/:businessId/container/:container/application/:applicationId')
  @HttpCode(HttpStatus.OK)
  public async removeByApplicationId(
    @Param() { container, businessId, applicationId }: ChangeContainerByApplicationDto,
  ): Promise<void> {
    let localBlobRecord: MediaItemModel;
    const records: MediaItemModel[] =
      await this.mediaItemService.getByApplicationIdAndContainer(applicationId, container);
    const blobNames: string[] = records.map(((record: MediaItemModel) => record.name));
    for (const blobName of blobNames) {
      localBlobRecord = await this.businessMediaService.findByName(businessId, container, blobName);

      if (localBlobRecord) {
        await this.storageService.deleteBlob(container, blobName);
        await this.businessMediaService.remove(businessId, container, blobName);
        await this.mediaItemService.remove(blobName, container);
      }
    }
  }

  @Delete(':container/:blobName')
  @HttpCode(HttpStatus.OK)
  public async remove(
    @Param() { container, businessId, blobName }: UploadMediaWithBlobNameDto,
  ): Promise<void> {
    let localBlobRecord: MediaItemModel;

    try {
      localBlobRecord = await this.businessMediaService.findByName(businessId, container, blobName);
    } catch (e) {
      throw new InternalServerErrorException(`Error occured while getting blob record: ${e}`);
    }

    if (localBlobRecord) {
      try {
        await this.storageService.deleteBlob(container, blobName);
        await this.businessMediaService.remove(businessId, container, blobName);
        await this.mediaItemService.remove(blobName, container);
      } catch (e) {
        throw new InternalServerErrorException(`Error occured while deleting blob: ${e}`);
      }
    } else {
      throw new BadRequestException('No blob record with specified name found for this business');
    }
  }

  @Delete()
  public async deleteByQuery(
    @Query() query: FileQueryDto,
  ): Promise<MediaItemModel[]> {
    const mediaItems: MediaItemModel[] = (await this.mediaItemService.getForAdmin(query)).documents;
    const businessIds: string[] =
      query.businessIds ? (Array.isArray(query.businessIds) ? query.businessIds : [query.businessIds]) : [];

    for (const mediaItem of mediaItems) {
      await this.storageService.deleteBlob(mediaItem.container, mediaItem.name);
      await this.businessMediaService.deleteMany({
        businessIds,
        container: mediaItem.container as any,
        name: mediaItem.name,
      });
    }

    return mediaItems;
  }
}
