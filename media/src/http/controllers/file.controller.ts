import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Get,
  Query,
  Body,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MimeTypeModel } from '../../media/models';
import { BlobStorageService } from '../../storage/services';
import {
  BlobCreatedDto,
  FsFile,
  MediaItemModel,
  FilesStorage,
  BusinessMediaService,
  MediaItemService,
  MimeTypeService,
  FileDownloaderService,
} from '../../media';
import {
  UploadMediaWithBlobNameDto,
  ChangeContainerByApplicationDto,
  GetByApplicationDto,
  UploadMediaOptionsDto,
  UploadMediaViaUrlOptionsDto,
} from '../dto';
import { Files } from '../decorators';
import { MultipartService } from '../services';
import { clamScanFilePipe } from '../pipes/clamscan.pipe';

@Controller('file/business/:businessId')
@ApiTags('business/file')
export class FileController {
  constructor(
    private readonly storageService: BlobStorageService,
    private readonly businessMediaService: BusinessMediaService,
    private readonly multipartService: MultipartService,
    private readonly filesStorage: FilesStorage,
    private readonly mediaItemService: MediaItemService,
    private readonly mimeTypeService: MimeTypeService,
    private readonly fileDownloaderService: FileDownloaderService,
  ) { }
  @Post(':container/application/:applicationId')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created',
    status: HttpStatus.CREATED,
    type: BlobCreatedDto,
  })
  public async create(
    @Param() { container, businessId, applicationId }: ChangeContainerByApplicationDto,
    @Files(
      {
        allowedMimeTypes: undefined,
        disableSanitizer: false,
        storeType: 'fs',
      },
      clamScanFilePipe,
    )
    files: FsFile[],
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
        businessId,
      ),
    );
  }

  @Post(':container/application/:applicationId/via-url')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created',
    status: HttpStatus.CREATED,
    type: BlobCreatedDto,
  })
  public async createFromUrl(
    @Param()
    { container, businessId, applicationId }: ChangeContainerByApplicationDto,
    @Body() options: UploadMediaViaUrlOptionsDto,
    @Query() optionsQuery: UploadMediaOptionsDto,
  ): Promise<BlobCreatedDto | BlobCreatedDto[]> {

    const fileInfo = await this.fileDownloaderService.getFileInfo(options.url);

    if (fileInfo.fileSize > 1024 * 1024 * 10) {
      throw new BadRequestException({
        message: 'Document type is not correct',
        statusCode: 400,
      });
    }

    const uploadedFileInfo: FsFile =
      await this.fileDownloaderService.downloadFile(options.url);

    const fileStorageFactory = this.filesStorage.storageFactory(
      this.businessMediaService,
      businessId,
      container,
      optionsQuery.compress,
      applicationId,
      optionsQuery.generateThumbnail,
      businessId
    );

    return fileStorageFactory(uploadedFileInfo);
  }

  @Get(':container/:applicationId')
  public async getFiles(
    @Param() { container, applicationId }: GetByApplicationDto,
  ): Promise<MediaItemModel[]> {
    return this.mediaItemService.getByApplicationIdAndContainer(applicationId, container);
  }

  @Delete(':container/application/:applicationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @Permission({entity: 'media', action: 'delete'})
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully deleted' })
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
      }
    }
  }

  @Delete(':container/:blobName')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @Permission({entity: 'media', action: 'delete'})
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully deleted' })
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

}
