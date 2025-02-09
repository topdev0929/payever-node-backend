import { 
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Param,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  Roles,
  RolesEnum,
} from '@pe/nest-kit/modules/auth';
import { DashboardAppDto, DefaultAppDto, ToggleDisallowedDto, ToggleInstallDto } from '../dto';
import { AdminService } from '../services/admin.service';
import { BusinessAppsService } from '../services/business.apps.service';

@Controller('/admin/apps')
@ApiTags('admin apps')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
export class AdminAppsController {
  constructor(
    private readonly adminService: AdminService,
    private readonly businessAppsService: BusinessAppsService,
  ) { }

  @Get('default')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: DefaultAppDto,
  })
  public async getDefaultApps(): Promise<DefaultAppDto[]> {
    return this.adminService.getDefaultApps();
  }

  @Post('default')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully created.',
    status: HttpStatus.OK,
    type: DefaultAppDto,
  })
  public async createDefaultApp(
    @Body() dto: DefaultAppDto,
  ): Promise<DefaultAppDto> {
    return this.adminService.createDefaultApp(dto);
  }

  @Patch('default/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully updated.',
    status: HttpStatus.OK,
    type: DefaultAppDto,
  })
  public async updateDefaultAppsById(
    @Param('id') id: string,
    @Body() dto: DefaultAppDto,
  ): Promise<DefaultAppDto> {
    return this.adminService.updateDefaultAppsById(id, dto);
  }

  @Delete('default/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully deleted.',
    status: HttpStatus.OK,
  })
  public async removeDefaultAppsById(
    @Param('id') id: string,
  ): Promise<void> {
    await this.adminService.removeDefaultAppsById(id);
  }

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: DashboardAppDto,
  })
  public async getDashboardApps(): Promise<DashboardAppDto[]> {
    return this.adminService.getDashboardApps();
  }

  @Post('dashboard')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully created.',
    status: HttpStatus.OK,
    type: DashboardAppDto,
  })
  public async createDashboardApp(
    @Body() dto: DashboardAppDto,
  ): Promise<DashboardAppDto> {
    return this.adminService.createDashboardApp(dto);
  }

  @Patch('dashboard/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully updated.',
    status: HttpStatus.OK,
    type: DashboardAppDto,
  })
  public async updateDashboardAppsById(
    @Param('id') id: string,
    @Body() dto: DashboardAppDto,
  ): Promise<DashboardAppDto> {
    return this.adminService.updateDashboardAppsById(id, dto);
  }

  @Delete('dashboard/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully deleted.',
    status: HttpStatus.OK,
  })
  public async removeDashboardAppsById(
    @Param('id') id: string,
  ): Promise<void> {
    await this.adminService.removeDashboardAppsById(id);
  }

  @Patch('/business/:businessId/toggle-installed/:microUuid')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The installed state has been successfully changed.',
    status: HttpStatus.CREATED,
  })
  public async toggleInstalled(
    @Param('businessId') businessId: string,
    @Param('microUuid') microUuid: string,
    @Body() toggleInstallDto: ToggleInstallDto,
  ): Promise<void> {
    return this.businessAppsService.toggleInstalled(toggleInstallDto, businessId, microUuid);
  }

  @Patch('/business/:businessId/toggle-disallowed/:microUuid')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The disallowed state has been successfully changed.',
    status: HttpStatus.CREATED,
  })
  public async toggleDisallowed(
    @Param('businessId') businessId: string,
    @Param('microUuid') microUuid: string,
    @Body() toggleDisallowedDto: ToggleDisallowedDto,
  ): Promise<void> {
    return this.businessAppsService.toggleDisallowed(toggleDisallowedDto, businessId, microUuid);
  }
}
