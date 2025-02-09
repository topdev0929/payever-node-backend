import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MediaContainersEnum } from '@pe/media-sdk';
import { ImageMimeTypes, SettingImageMimeTypes } from '../../tools/mime-types.enum';
import { BlobStorageService } from '../../storage/services';
import {
  BlobCreatedDto,
  MemFile,
  BusinessMediaService,
  ImagesStorage,
  MediaItemService,
  GenerateThumbnailService,
  MediaItemModel,
} from '../../media';
import { getCdnContainerName } from '../../media/enum';
import { Files } from '../decorators';
import { UploadMediaDto, UploadMediaWithBlobNameDto } from '../dto';
import { MultipartService } from '../services';
import { clamScanFilePipe } from '../pipes/clamscan.pipe';

@Controller('image/business/:businessId')
@ApiTags('business/image')
export class ImagesController {
  constructor(
    private readonly storageService: BlobStorageService,
    private readonly businessMediaService: BusinessMediaService,
    private readonly multipartService: MultipartService,
    private readonly imagesStorage: ImagesStorage,
    private readonly mediaItemService: MediaItemService,
    private readonly generateThumbnailService: GenerateThumbnailService,
    private readonly logger: Logger,
  ) { }

  @Post('cdn/:container')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created',
    status: HttpStatus.CREATED,
    type: BlobCreatedDto,
  })
  public async createCdn(
    @Query('skipResize') skipResize: boolean,
    @Query('skipGradient') skipGradient: boolean,
    @Param() { container, businessId }: UploadMediaDto,
    @Files(
      {
        allowedMimeTypes: ImageMimeTypes,
        disableSanitizer: false,
        storeType: 'memory',
      },
      clamScanFilePipe,
    ) files: MemFile[],
  ): Promise<BlobCreatedDto[] | BlobCreatedDto> {
    return this.multipartService.handleFiles(
      files,
      this.imagesStorage.storageFactory(
        this.businessMediaService,
        businessId,
        getCdnContainerName(container),
        null,
        { skipResize, skipGradient },
      ),
    );
  }

  @Post('cdn/:container/:blobName')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created',
    status: HttpStatus.CREATED,
    type: BlobCreatedDto,
  })
  public async createCdnWithBlobName(
    @Query('skipResize') skipResize: boolean,
    @Query('skipGradient') skipGradient: boolean,
    @Param() { container, businessId, blobName }: UploadMediaWithBlobNameDto,
    @Files(
      {
        allowedMimeTypes: ImageMimeTypes,
        disableSanitizer: false,
        storeType: 'memory',
      },
      clamScanFilePipe,
    ) files: MemFile[],
  ): Promise<BlobCreatedDto[] | BlobCreatedDto> {
    return this.multipartService.handleFiles(
      files,
      this.imagesStorage.storageFactory(
        this.businessMediaService,
        businessId,
        getCdnContainerName(container),
        blobName,
        { skipResize, skipGradient },
      ),
    );
  }

  @Post('setting/:container')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'Setting image has been successfully created',
    status: HttpStatus.CREATED,
    type: BlobCreatedDto,
  })
  public async settingImages(
    @Param() { container, businessId }: UploadMediaDto,
    @Files(
      {
        allowedMimeTypes: SettingImageMimeTypes,
        disableSanitizer: false,
        storeType: 'memory',
      },
      clamScanFilePipe,
    ) files: MemFile[],
  ): Promise<BlobCreatedDto[] | BlobCreatedDto> {
    return this.multipartService.handleFiles(
      files,
      this.imagesStorage.storageFactory(
        this.businessMediaService,
        businessId,
        container,
      ),
    );
  }

  @Post(':container')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created',
    status: HttpStatus.CREATED,
    type: BlobCreatedDto,
  })
  // eslint-disable-next-line sonarjs/no-identical-functions
  public async create(
    @Param() { container, businessId }: UploadMediaDto,
    @Files(
      {
        allowedMimeTypes: ImageMimeTypes,
        disableSanitizer: false,
        storeType: 'memory',
      },
      clamScanFilePipe,
    ) files: MemFile[],
  ): Promise<BlobCreatedDto[] | BlobCreatedDto> {
    return this.multipartService.handleFiles(
      files,
      this.imagesStorage.storageFactory(
        this.businessMediaService,
        businessId,
        container,
      ),
    );
  }

  @Post(':container/:blobName')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created',
    status: HttpStatus.CREATED,
    type: BlobCreatedDto,
  })
  public async createWithBlobName(
    @Param() { container, businessId, blobName }: UploadMediaWithBlobNameDto,
    @Files(
      {
        allowedMimeTypes: ImageMimeTypes,
        disableSanitizer: false,
        storeType: 'memory',
      },
      clamScanFilePipe,
    ) files: MemFile[],
  ): Promise<BlobCreatedDto[] | BlobCreatedDto> {
    return this.multipartService.handleFiles(
      files,
      this.imagesStorage.storageFactory(
        this.businessMediaService,
        businessId,
        container,
        blobName,
      ),
    );
  }

  @Delete(':container/:blobName')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully deleted' })
  public async remove(
    @Param() { container, businessId, blobName }: UploadMediaWithBlobNameDto,
  ): Promise<void> {
    let localBlobRecord: MediaItemModel;
    let localBlurredBlobRecord: MediaItemModel;
    const blurredBlobName: string = `${blobName}-blurred`;

    try {
      localBlobRecord = await this.businessMediaService.findByName(businessId, container, blobName);
      if (container === MediaContainersEnum.Wallpapers) {
        localBlurredBlobRecord = await this.businessMediaService.findByName(businessId, container, blurredBlobName);
      }
    } catch (e) {
      throw new InternalServerErrorException(`Error occured while getting blob record: ${e}`);
    }

    if (localBlobRecord) {
      try {
        await this.storageService.deleteBlob(container, blobName);
        await this.businessMediaService.remove(businessId, container, blobName);
        await this.mediaItemService.remove(blobName, container);

        if (localBlurredBlobRecord) {
          await this.storageService.deleteBlob(container, blurredBlobName);
          await this.businessMediaService.remove(businessId, container, blurredBlobName);
        }
      } catch (e) {
        throw new InternalServerErrorException(`Error occured while deleting blob: ${e}`);
      }
    } else {
      throw new BadRequestException('No blob record with specified name found for this business');
    }
  }

  @Patch(':container/:blobName')
  @HttpCode(HttpStatus.OK)
  // @Permission({entity: 'media', action: 'delete'})
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully updated' })
  public async update(
    @Param() { container, businessId, blobName }: UploadMediaWithBlobNameDto,
  ): Promise<string> {
    this.logger.log(`${businessId}-${container}-${blobName}`);
    const localBlobRecord: MediaItemModel =
      await this.businessMediaService.findByName(businessId, container, blobName);
    this.logger.log(`${localBlobRecord.name}`);

    return this.generateThumbnailService.generateFromBlob(localBlobRecord, container, businessId);
  }
}
