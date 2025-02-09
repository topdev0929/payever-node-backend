import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { VideoMimeTypes } from '../../tools/mime-types.enum';

import { BlobStorageService } from '../../storage/services';
import { getCdnContainerName } from '../../media/enum';

import {
  BlobCreatedDto,
  MediaModel,
  FsFile,
  BusinessMediaService,
  MediaItemService,
  VideoStorageService,
  MediaItemModel,
} from '../../media';

import { UploadMediaDto, UploadMediaWithBlobNameDto } from '../dto';
import { Files } from '../decorators';
import { MultipartService } from '../services';
import { clamScanFilePipe } from '../pipes';

@Controller('video/business/:businessId')
@ApiTags('business/video')
export class VideoController {
  constructor(
    private readonly multipartService: MultipartService,
    private readonly mediaItemService: MediaItemService,
    private readonly videoStorageService: VideoStorageService,
    private readonly blobStorageService: BlobStorageService,
    private readonly businessMediaService: BusinessMediaService,
  ) { }

  @Post('/:container')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created',
    status: HttpStatus.CREATED,
    type: BlobCreatedDto,
  })
  public async create(
    @Param() { container, businessId }: UploadMediaDto,
    @Files(
      {
        allowedMimeTypes: VideoMimeTypes,
        disableSanitizer: false,
        storeType: 'fs',
      },
      clamScanFilePipe,
    ) files: FsFile[],
  ): Promise<BlobCreatedDto | BlobCreatedDto[]> {
    return this.multipartService.handleFiles(
      files,
      this.videoStorageService.storageFactory(
        this.businessMediaService,
        businessId,
        container,
      ),
    );
  }

  @Delete('/:container/:blobName')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully deleted' })
  public async remove(
    @Param() { container, businessId, blobName }: UploadMediaWithBlobNameDto,
  ): Promise<void> {
    const businessMediaModel: MediaItemModel =
      await this.businessMediaService.findByName(businessId, container, blobName);
    if (businessMediaModel) {
      try {
        await this.blobStorageService.deleteBlob(container, blobName);
        await this.blobStorageService.deleteBlob(container, `${blobName}_preview`);
        await this.businessMediaService.remove(businessId, container, blobName);
      } catch (e) {
        throw new InternalServerErrorException(`Error occurred while deleting blob: ${e}`);
      }
    } else {
      throw new BadRequestException('No blob record with specified name found for this business');
    }
  }

  @Post('cdn/:container')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created',
    status: HttpStatus.CREATED,
    type: BlobCreatedDto,
  })
  public async createOnCdn(
    @Param() { container, businessId }: UploadMediaDto,
    @Files(
      {
        allowedMimeTypes: VideoMimeTypes,
        disableSanitizer: false,
        storeType: 'fs',
      },
      clamScanFilePipe,
    ) files: FsFile[],
  ): Promise<BlobCreatedDto[] | BlobCreatedDto> {
    return this.multipartService.handleFiles(
      files,
      this.videoStorageService.storageFactory(
        this.businessMediaService,
        businessId,
        getCdnContainerName(container),
      ),
    );
  }

  @Delete('cdn/:container/:blobName')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully deleted' })
  public async removeOnCdn(
    @Param() { container, businessId, blobName }: UploadMediaWithBlobNameDto,
  ): Promise<void> {
    const containerName: string = `cdn/${container}`;
    const businessMediaModel: MediaItemModel =
      await this.businessMediaService.findByName(businessId, containerName, blobName);
    if (businessMediaModel) {
      try {
        await this.blobStorageService.deleteBlob(containerName, blobName);
        await this.blobStorageService.deleteBlob(containerName, `${blobName}_preview`);
        await this.mediaItemService.remove(blobName, containerName);
        await this.businessMediaService.remove(businessId, containerName, blobName);
      } catch (e) {
        throw new InternalServerErrorException(`Error occurred while deleting blob: ${e}`);
      }
    } else {
      throw new BadRequestException('No blob record with specified name found for this business');
    }
  }
}
