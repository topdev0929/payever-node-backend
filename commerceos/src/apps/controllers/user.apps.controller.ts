import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserType } from '@pe/app-registry-sdk';
import { AccessTokenPayload, JwtAuthGuard, Roles, RolesEnum, User } from '@pe/nest-kit/modules/auth';
import { UserAppsService } from '../services/user.apps.service';
import { GetAppDto, ToggleInstallAppDto, ToggleInstallDto } from '../dto';
import { RegisteredApp } from '../interfaces/registered-app';

@Controller('apps')
@ApiTags('personal apps')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserAppsController {
  constructor(private readonly userAppsService: UserAppsService) { }

  @Get('user')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: GetAppDto,
  })
  public async getUserApps(@User() user: AccessTokenPayload): Promise<RegisteredApp[]> {
    return this.userAppsService.get(user.id, UserType.User);
  }

  @Get('admin')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: GetAppDto,
  })
  public async getAdminApps(@User() user: AccessTokenPayload): Promise<RegisteredApp[]> {
    return this.userAppsService.get(user.id, UserType.Admin);
  }

  @Get('partner')
  @Roles(RolesEnum.partner)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The apps have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: GetAppDto,
  })
  public async getPartnerApps(@User() user: AccessTokenPayload): Promise<RegisteredApp[]> {
    return this.userAppsService.get(user.id, UserType.Partner);
  }

  @Patch('user/toggle-installed/:microUuid')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The installed state has been successfully changed.',
    status: HttpStatus.CREATED,
  })
  public async userToggleInstalled(
    @User() user: AccessTokenPayload,
    @Param('microUuid') microUuid: string,
    @Body() toggleInstallAppDto: ToggleInstallDto,
  ): Promise<void> {
    return this.userAppsService.userToggleInstalled(toggleInstallAppDto, microUuid, user.id, UserType.User);
  }

  @Post('admin/toggle-installed')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The installed state has been successfully changed.',
    status: HttpStatus.CREATED,
  })
  public async adminToggleInstalled(
    @User() user: AccessTokenPayload,
    @Body() toggleInstallAppDto: ToggleInstallAppDto,
  ): Promise<void> {
    return this.userAppsService.toggleInstalled(toggleInstallAppDto, user.id, UserType.Admin);
  }

  @Post('partner/toggle-installed')
  @Roles(RolesEnum.partner)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The installed state has been successfully changed.',
    status: HttpStatus.CREATED,
  })
  public async partnerToggleInstalled(
    @User() user: AccessTokenPayload,
    @Body() toggleInstallAppDto: ToggleInstallAppDto,
  ): Promise<void> {
    return this.userAppsService.toggleInstalled(toggleInstallAppDto, user.id, UserType.Partner);
  }
}
