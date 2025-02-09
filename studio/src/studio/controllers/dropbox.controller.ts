import { Controller, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, Acl, AclActionsEnum, EventDispatcher, ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { PaginationDto } from '../dto';
import { DropboxService } from '../services';
import { DropboxMediaSchemaName } from '../schemas';
import { DropboxMediaModel } from '../models';
import { EventEnum, MediaTypeEnum } from '../enums';
import { DropboxPaginationInterface } from '../interfaces';

@Controller('dropbox')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('Attribute API')
export class DropboxController extends AbstractController{
  constructor(
    private readonly dropboxCrawlerService: DropboxService,
    private readonly eventDispatcher: EventDispatcher,
  ) {
    super();
  }

  @Get()
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getAll(
    @Query() pagination: PaginationDto,
  ): Promise<DropboxPaginationInterface> {
    return this.dropboxCrawlerService.getDropboxMedia(pagination);
  }

  @Get('image')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getImages(
    @Query() pagination: PaginationDto,
  ): Promise<DropboxPaginationInterface> {
    return this.dropboxCrawlerService.getDropboxMedia(pagination, MediaTypeEnum.IMAGE);
  }

  @Get('video')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getVideos(
    @Query() pagination: PaginationDto,
  ): Promise<DropboxPaginationInterface> {
    return this.dropboxCrawlerService.getDropboxMedia(pagination, MediaTypeEnum.VIDEO);
  }

  @Get('failed')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getFailed(
    @Query() pagination: PaginationDto,
  ): Promise<DropboxPaginationInterface> {
    return this.dropboxCrawlerService.getFailed(pagination);
  }

  @Get('mining')
  @Roles(RolesEnum.admin)
  public async mining(
    @Query('path') path: string,
  ): Promise<any> {
    return this.eventDispatcher.dispatch(EventEnum.DROPBOX_MINING_TRIGGER, path);
  }

  @Get('download')
  @Roles(RolesEnum.admin)
  public async videoDownload(
    @Query('path') path: string,
  ): Promise<any> {
    return this.eventDispatcher.dispatch(EventEnum.DROPBOX_DOWNLOAD_TRIGGER);
  }

  @Get('excel')
  @Roles(RolesEnum.admin)
  public async excel(
    @Query('path') path: string,
  ): Promise<any> {
    this.eventDispatcher.dispatch(EventEnum.DROPBOX_EXCEL_TRIGGER, path).catch();
  }

  @Get('set/attribute')
  @Roles(RolesEnum.admin)
  public async setAttribute(
    @Query('path') path: string,
  ): Promise<any> {
    return this.eventDispatcher.dispatch(EventEnum.DROPBOX_SET_ATTRIBUTE_TRIGGER, path);
  }

  @Get('reset')
  @Roles(RolesEnum.admin)
  public async resetError(
    @Query('path') path: string,
  ): Promise<{ ok: number }> {
    return this.dropboxCrawlerService.resetError();
  }

  @Get(':dropboxId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getById(
    @ParamModel('dropboxId', DropboxMediaSchemaName) dropbox: DropboxMediaModel,
  ): Promise<DropboxMediaModel> {
    return dropbox;
  }

  @Delete(':dropboxId')
  @Roles(RolesEnum.admin)
  public async delete(
    @ParamModel('dropboxId', DropboxMediaSchemaName) dropbox: DropboxMediaModel,
  ): Promise<void> {
    await dropbox.deleteOne();
  }
}
