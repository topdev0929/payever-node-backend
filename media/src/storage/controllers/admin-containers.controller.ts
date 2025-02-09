import {
  Body, Controller, Delete, Get, Param, Post, Query,
  HttpStatus, UseGuards, HttpCode, NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { AdminCreateContainerDto } from '../dto';
import { BlobStorageService } from '../services';


@Controller('admin/containers')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('Admin Containers')
export class AdminContainersController {
  constructor(
    private readonly blosbStorageService: BlobStorageService,
  ) { }

  @Get()
  public async listContainersSegmented(
    @Query('continuationToken') continuationToken: string,
  ): Promise<any> {
    return this.blosbStorageService.listContainersSegmented(continuationToken);
  }

  @Get(':containerName')
  public async getByContainerName(
    @Param('containerName') containerName: string,
  ): Promise<any> {
    return this.blosbStorageService.getContainerProperties(containerName);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() dto: AdminCreateContainerDto,
  ): Promise<any> {
    return this.blosbStorageService.createContainer(dto.name);
  }

  @Delete(':containerName')
  @HttpCode(HttpStatus.OK)
  public async deleteByContainerName(
    @Param('containerName') containerName: string,
  ): Promise<any> {    
    if (!(await this.blosbStorageService.doesContainerExist(containerName))) {          
      throw new NotFoundException(`container ${containerName} does not exist`);
    }

    return this.blosbStorageService.deleteContainer(containerName);
  }
}
