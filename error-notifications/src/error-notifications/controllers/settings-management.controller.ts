import { Body, Controller, Get, HttpException, Param, Patch, UseGuards, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesEnum, Acl, AclActionsEnum } from '@pe/nest-kit/modules/auth';
import { plainToClass } from 'class-transformer';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SettingsService, ValidationService } from '../services';
import { ErrorNotificationTypesEnum, SendingMethodEnum } from '../enums';
import { UpdateSettingsDto, SettingsDto, UpdateSettingsBundleDto } from '../dto';
import {
  IntegrationRelatedErrorTypes,
  SendingByCronUpdateIntervalErrorTypes,
  SendingByAfterIntervalErrorTypes,
} from '../constants';

@Controller('business/:businessId/settings')
@UseGuards(JwtAuthGuard)
@ApiTags('Settings')
@ApiBearerAuth()
@Roles(RolesEnum.admin, RolesEnum.merchant)
export class SettingsManagementController {

  constructor(
    private readonly settingsService: SettingsService,
  ) {
  }

  @Get()
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  @ApiResponse({ type: [SettingsDto], status: HttpStatus.OK })
  public async getSettings(
    @Param('businessId') businessId: string,
  ): Promise<SettingsDto[]> {
    return this.settingsService.getSettingsByBusiness(businessId);
  }

  @Get('type/:type')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  @ApiResponse({ type: SettingsDto, status: HttpStatus.OK })
  public async getSettingsByType(
    @Param('businessId') businessId: string,
    @Param('type') type: ErrorNotificationTypesEnum,
  ): Promise<SettingsDto> {
    return this.settingsService.getSettingsByParams(businessId, type, null);
  }

  @Get('type/:type/integration/:integration')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  @ApiResponse({ type: SettingsDto, status: HttpStatus.OK })
  public async getSettingsByTypeAndIntegration(
    @Param('businessId') businessId: string,
    @Param('type') type: ErrorNotificationTypesEnum,
    @Param('integration') integration: string,
  ): Promise<SettingsDto> {
    return this.settingsService.getSettingsByParams(businessId, type, integration);
  }

  @Patch()
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  @ApiBody({ type: [UpdateSettingsBundleDto]})
  @ApiResponse({ type: [SettingsDto], status: HttpStatus.ACCEPTED })
  public async saveSettings(
    @Param('businessId') businessId: string,
    @Body() payload: any,
  ): Promise<SettingsDto[]> {
    const updateSettings: UpdateSettingsBundleDto[] = plainToClass<UpdateSettingsBundleDto, []>(
      UpdateSettingsBundleDto,
      payload,
    );
    for (const updateSetting of updateSettings) {
      const groups: string[] = this.prepareScoreValidationGroups(updateSetting.type);
      if (IntegrationRelatedErrorTypes.includes(updateSetting.type)) {
        groups.push('integration-related');
      } else {
        groups.push('business-related');
      }
      await ValidationService.validate(updateSetting, groups);
    }

    const result: SettingsDto[] = [];
    for (const updateSetting of updateSettings) {
      result.push(
        await this.settingsService.saveSettingsByParams(
          businessId,
          updateSetting.type,
          updateSetting.integration,
          updateSetting,
        ),
      );
    }

    return result;
  }

  @Patch('type/:type')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  @ApiBody({ type: UpdateSettingsDto})
  @ApiResponse({ type: SettingsDto, status: HttpStatus.ACCEPTED })
  public async saveSettingsByType(
    @Param('businessId') businessId: string,
    @Param('type') type: ErrorNotificationTypesEnum,
    @Body() updateSettingsPayload: any,
  ): Promise<SettingsDto> {
    if (IntegrationRelatedErrorTypes.includes(type)) {
      throw new HttpException(`Bad request. Integration hasn't specified for error type: ${type} `, 400);
    }
    const updateSettingsDetails: UpdateSettingsDto = plainToClass<UpdateSettingsDto, any>(
      UpdateSettingsDto,
      updateSettingsPayload,
    );
    await ValidationService.validate(updateSettingsDetails, this.prepareScoreValidationGroups(type));

    return this.settingsService.saveSettingsByParams(businessId, type, null, updateSettingsDetails);
  }

  @Patch('type/:type/integration/:integration')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.update })
  @ApiBody({ type: UpdateSettingsDto})
  @ApiResponse({ type: SettingsDto, status: HttpStatus.ACCEPTED })
  public async saveSettingsByTypeAndIntegration(
    @Param('businessId') businessId: string,
    @Param('type') type: ErrorNotificationTypesEnum,
    @Param('integration') integration: string,
    @Body() updateSettingsPayload: any,
  ): Promise<SettingsDto> {
    const updateSettingsDetails: UpdateSettingsDto = plainToClass<UpdateSettingsDto, any>(
      UpdateSettingsDto,
      updateSettingsPayload,
    );
    await ValidationService.validate(updateSettingsDetails, this.prepareScoreValidationGroups(type));

    return this.settingsService.saveSettingsByParams(businessId, type, integration, updateSettingsDetails);
  }

  private prepareScoreValidationGroups(
    type: ErrorNotificationTypesEnum,
  ): string[] {
    const groups: string[] = [];
    if (SendingByCronUpdateIntervalErrorTypes.includes(type)) {
      groups.push(SendingMethodEnum.sendByCronInterval);
    }

    if (SendingByAfterIntervalErrorTypes.includes(type)) {
      groups.push(SendingMethodEnum.sendByAfterInterval);
    }

    return groups;
  }
}
