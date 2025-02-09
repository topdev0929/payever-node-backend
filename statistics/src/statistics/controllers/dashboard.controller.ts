import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, Delete, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { ParamModel, Acl, AclActionsEnum } from '@pe/nest-kit';
import { CreateDashboardDto, DashboardDto, UpdateDashboardDto, DashboardDetailsDto } from '../dto';
import { BusinessModel, CubeModel, DashboardModel } from '../models';
import { CubeService, DashboardService } from '../services';
import { BusinessSchemaName, DashboardSchemaName } from '../schemas';

const NOT_FOUND: string = 'Not found.';

@Controller('business/:businessId/dashboard')
@ApiTags('dashboard')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly cubeService: CubeService,
  ) {
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: DashboardDto,
  })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.read })
  public async findAll(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<DashboardDetailsDto[]> {
    const dashboards: DashboardModel[] = await this.dashboardService.findAllByBusiness(business);
    const cubes: CubeModel[] = await this.cubeService.findAll();
    const availableTypes: string[] = cubes
    .map((cube: CubeModel) => cube.code)
    .filter((code: string) => code !== 'message'  && code !== 'blog' );

    return dashboards.map((dashboard: DashboardModel) => {
      
      return {
        _id: dashboard._id,
        availableTypes,
        business: {
          _id: business._id,
          name: business.name,
        },
        isDefault: dashboard.isDefault,
        name: dashboard.name,
      } as DashboardDetailsDto;
    });
  }

  @Get(':dashboardId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The record has been successfully fetched.',
    status: HttpStatus.OK,
    type: DashboardDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: NOT_FOUND })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.read })
  public async findOne(
    @ParamModel('dashboardId', DashboardSchemaName) dashboard: DashboardModel,
  ): Promise<DashboardModel> {
    await dashboard.populate('business').execPopulate();

    return dashboard;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created.',
    status: HttpStatus.CREATED,
    type: DashboardDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: NOT_FOUND })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.create })
  public async create(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @Body() dto: CreateDashboardDto,
  ): Promise<any> {
    return this.dashboardService.create(dto, business);
  }

  @Put(':dashboardId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The record has been successfully updated.',
    status: HttpStatus.OK,
    type: DashboardDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: NOT_FOUND })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.update })
  public async update(
    @ParamModel('dashboardId', DashboardSchemaName) dashboard: DashboardModel,
    @Body() dto: UpdateDashboardDto,
  ): Promise<DashboardModel> {
    return this.dashboardService.update(dashboard, dto);
  }

  @Put(':dashboardId/set-as-default')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The record has been successfully updated.',
    status: HttpStatus.OK,
    type: DashboardDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: NOT_FOUND })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.update })
  public async setAsDefault(
    @ParamModel('dashboardId', DashboardSchemaName) dashboard: DashboardModel,
  ): Promise<DashboardModel> {
    return this.dashboardService.setAsDefault(dashboard);
  }

  @Delete(':dashboardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: NOT_FOUND })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.delete })
  public async remove(
    @ParamModel('dashboardId', DashboardSchemaName) dashboard: DashboardModel,
  ): Promise<void> {
    await this.dashboardService.remove(dashboard);
  }
}
