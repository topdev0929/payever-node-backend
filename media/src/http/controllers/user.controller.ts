import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, JwtAuthGuard, Roles, RolesEnum, User } from '@pe/nest-kit/modules/auth';
import { ImageMimeTypes } from '../../tools/mime-types.enum';
import {
  BlobCreatedDto,
  MemFile,
  ImagesStorage,
  MediaItemService,
  UserMediaService,
  MediaItemModel,
} from '../../media';
import { BlobStorageService } from '../../storage/services';
import { Files } from '../decorators';
import { ContainerDto, ContainerWithBlobNameDto } from '../dto';
import { MultipartService } from '../services';
import { clamScanFilePipe } from '../pipes/clamscan.pipe';

@Controller('image/user/:userId')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.user)
@ApiTags('user/image')
export class UserController {

  private WallpapersMediaContainerType: string = 'wallpapers';

  constructor(
    private readonly multipartService: MultipartService,
    private readonly storageService: BlobStorageService,
    private readonly userMediaService: UserMediaService,
    private readonly imagesStorage: ImagesStorage,
    private readonly mediaItemService: MediaItemService,
  ) { }

  @Post(':container')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created',
    status: HttpStatus.CREATED,
    type: BlobCreatedDto,
  })
  public async create(
    @Param() { container }: ContainerDto,
    @User() user: AccessTokenPayload,
    @Files(
      {
        allowedMimeTypes: ImageMimeTypes,
        disableSanitizer: false,
        storeType: 'memory',
      },
      clamScanFilePipe,
    ) files: MemFile[],
  ): Promise<BlobCreatedDto | BlobCreatedDto[]> {
    return this.multipartService.handleFiles(
      files,
      this.imagesStorage.storageFactory(
        this.userMediaService,
        user.id,
        container,
      ),
    );
  }

  @Delete(':container/:blobName')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully deleted' })
  public async remove(
    @Param() { container, blobName }: ContainerWithBlobNameDto,
    @User() user: AccessTokenPayload,
  ): Promise<void> {
    let localBlurredBlobRecord: MediaItemModel;
    const blurredBlobName: string = `${blobName}-blurred`;

    const localBlobRecord: MediaItemModel = await this.userMediaService.findByName(user.id, container, blobName);
    if (!localBlobRecord) {
      throw new NotFoundException('No blob record with specified name found for this user');
    }

    if (container === this.WallpapersMediaContainerType) {
      localBlurredBlobRecord = await this.userMediaService.findByName(user.id, container, blurredBlobName);
    }

    await this.storageService.deleteBlob(container, blobName);
    await this.userMediaService.remove(user.id, container, blobName);
    await this.mediaItemService.remove(blobName, container);
    if (localBlurredBlobRecord) {
      await this.storageService.deleteBlob(container, blurredBlobName);
      await this.userMediaService.remove(user.id, container, blurredBlobName);
      await this.mediaItemService.remove(blurredBlobName, container);
    }
  }
}
