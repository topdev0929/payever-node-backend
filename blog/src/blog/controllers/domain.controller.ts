import { Body, ConflictException, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { DomainCheckInterface } from '../interfaces';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AbstractController, Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { DomainService } from '../services';
import { BlogModel, DomainModel } from '../models';
import { BlogSchemaName, DomainSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { Populable } from '../../dev-kit-extras/population';
import { CreateDomainDto, DomainCheckResultDto, DomainResponseDto, UpdateDomainDto } from '../dto';


@Controller('business/:businessId/blog')
@ApiTags('domains')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class DomainController extends AbstractController {
  constructor(
    private readonly domainService: DomainService,
  ) {
    super();
  }

  @Get(':blogId/domain')
  @Acl({ microservice: 'blog', action: AclActionsEnum.read })
  @ApiOperation({
    description: 'Getting domains by blog id',
  })
  @ApiResponse({
    description: 'Return domains',
    isArray: true,
    status: 200,
  })
  @ApiTags('list')
  public async getDomainsByBlog(
    @ParamModel(':blogId', BlogSchemaName ) blog: Populable<BlogModel>,
  ): Promise<DomainResponseDto[]> {
    const foundDomains: Array<Populable<DomainModel>> = await this.domainService.findByBlog(blog);

    return Promise.all(foundDomains.map(
      (domain: Populable<DomainModel>) => this.domainService.domainToDomainResponseDto(domain)),
    );
  }

  @Post(':blogId/domain')
  @Acl({ microservice: 'blog', action: AclActionsEnum.create })
  @ApiOperation({
    description: 'Adding new domain for blog',
  })
  @ApiResponse({
    description: 'Returns domain',
    status: 201,
  })
  @ApiTags('create')
  public async createDomain(
    @ParamModel(':blogId', BlogSchemaName) blog: Populable<BlogModel>,
    @Body() dto: CreateDomainDto,
  ): Promise<DomainResponseDto> {
    try {
      const newDomain: any = await this.domainService.create(blog, dto);

      return this.domainService.domainToDomainResponseDto(newDomain);
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictException(`Domain already used.`);
      } else {
        throw err;
      }
    }
  }

  @Post(':blogId/domain/:domainId/check')
  @Acl({ microservice: 'blog', action: AclActionsEnum.read })
  @ApiOperation({
    description: 'Checking domain\'s dns records',
  })
  @ApiResponse({
    description: 'Returns status object',
    status: 200,
    type: DomainCheckResultDto,
  })
  public async checkDomainStatus(
    @ParamModel(':domainId', DomainSchemaName) domain: Populable<DomainModel>,
  ): Promise<DomainCheckInterface> {
    return this.domainService.checkStatus(domain);
  }

  @Patch(':blogId/domain/:domainId')
  @Acl({ microservice: 'blog', action: AclActionsEnum.update })
  @ApiOperation({
    description: 'Updating domain info',
  })
  @ApiResponse({
    description: 'Returns domain',
    status: 200,
  })
  @ApiTags('update')
  public async updateDomain(
    @ParamModel(':domainId', DomainSchemaName) domain: Populable<DomainModel>,
    @Body() payload: UpdateDomainDto,
  ): Promise<DomainResponseDto> {
    const updatedDomain: any = await this.domainService.update(domain, payload);

    return this.domainService.domainToDomainResponseDto(updatedDomain);
  }

  @Delete(':blogId/domain/:domainId/')
  @Acl({ microservice: 'blog', action: AclActionsEnum.delete })
  @ApiOperation({
    description: 'Delete blog\'s domain',
  })
  @ApiTags('delete')
  public async deleteDomain(
    @ParamModel(':domainId', DomainSchemaName) domain: Populable<DomainModel>,
  ): Promise<void> {
    await this.domainService.delete(domain);
  }
}
