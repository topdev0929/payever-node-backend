import { FastifyReply } from 'fastify';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { MediaContainersEnum } from '@pe/media-sdk';
import { ImageMimeTypes, MimeTypesEnum, PluginsRelatedMimeTypes } from '../../tools/mime-types.enum';
import { environment } from '../../environments';
import { DataModel } from '../../media/models';
import {
  FsFile,
  DbStorageService,
  MediaItemService,
} from '../../media';
import { BlobStorageService } from '../../storage/services';
import { CreateDocumentDto, FileUploadDto, UpdateDataDto } from '../dto';
import { Files } from '../decorators';
import { MultipartService } from '../services';
import { clamScanFilePipe } from '../pipes/clamscan.pipe';

const acceptedFileMimeTypes: MimeTypesEnum[] = [
  ...ImageMimeTypes,
  ...PluginsRelatedMimeTypes,
  MimeTypesEnum.XML,
  MimeTypesEnum.CSV,
  MimeTypesEnum.XLSX,
  MimeTypesEnum.ODS,
  MimeTypesEnum.JAVASCRIPT,
];

@Controller('storage')
@ApiTags('storage')
export class StorageController {
  constructor(
    private readonly storageService: DbStorageService,
    private readonly blobStorageService: BlobStorageService,
    private readonly multipartService: MultipartService,
    private readonly mediaItemService: MediaItemService,
  ) {
  }

  @Get(':id')
  @ApiOperation({ summary: 'getFile', description: 'Getting a file by id' })
  public async get(
    @Param('id') id: string,
    @Res() res: FastifyReply,
  ): Promise<void> {
    const doc: DataModel = await this.storageService.getById(id);
    if (!doc) {
      res.status(HttpStatus.NO_CONTENT).send();
    } else {
      res.status(HttpStatus.OK).send(doc);
    }
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'createDocument', description: 'Creating a document' })
  @ApiResponse({
    description: 'The record has been successfully created',
    status: HttpStatus.CREATED,
  })
  public async create(
    @Body() dto: CreateDocumentDto,
  ): Promise<{ id: string }> {
    if (dto.expiresAt && new Date(dto.expiresAt) <= new Date()) {
      throw new BadRequestException('expiresAt should be greater that current date');
    }

    const data: DataModel = await this.storageService.createData(dto);

    return { id: data._id };
  }

  // TODO: add bearer authentication. should be done in: MM-79
  // @UseGuards(new InternalBasicAuthGuard(environment.internalBasicAuthLogin, environment.internalBasicAuthPassword))
  @Post('file')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.merchant)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'createFile', description: 'Creating a file' })
  @ApiResponse({
    description: 'The record has been successfully created',
    status: HttpStatus.CREATED,
    type: FileUploadDto,
  })
  public async createFile(
    @Files(
      {
        allowedMimeTypes: acceptedFileMimeTypes,
        disableSanitizer: false,
        storeType: 'fs',
      },
      clamScanFilePipe,
    ) files: FsFile[],
  ): Promise<FileUploadDto[] | FileUploadDto> {
    const asyncHandler: (file: FsFile) => Promise<FileUploadDto> = async (file: FsFile): Promise<FileUploadDto> => {
      await this.blobStorageService.createBlobFromFs(
        file,
        MediaContainersEnum.Miscellaneous,
        file.uniqfileName,
      );
      const fileName: string = file.uniqfileName;
      const data: DataModel = await this.storageService.createFile(fileName);
      await this.mediaItemService.create(fileName, MediaContainersEnum.Miscellaneous);

      return {
        id: data._id,
        url: `${environment.storage_url}/miscellaneous/${fileName}`,
      };
    };

    return this.multipartService.handleFiles(
      files,
      asyncHandler,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'updateDataById', description: 'Updating a file' })
  public async updateDataById(
    @Param('id') id: string,
    @Body() updateDto: UpdateDataDto,
  ): Promise<DataModel> {
    const doc: DataModel = await this.storageService.getById(id);
    if (!doc) {
      throw new NotFoundException(`Document id=${id} not found`);
    }

    return this.storageService.updateById(id, updateDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'updateOrCreateDataById', description: 'Creating a file' })
  public async updateOrCreateDataById(
    @Param('id') id: string,
    @Body() updateDto: UpdateDataDto,
  ): Promise<DataModel>  {
    const doc: DataModel = await this.storageService.getById(id);
    if (doc) {
      return this.storageService.updateById(id, updateDto);
    }

    return this.storageService.createData({ ...updateDto, id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'deleteFile', description: 'Deleting a file' })
  public async delete(@Param('id') id: string): Promise<void>  {
    const doc: DataModel = await this.storageService.getById(id);
    if (!doc) {
      throw new NotFoundException(`Document id=${id} not found`);
    }

    await this.storageService.deleteById(id);
  }
}
