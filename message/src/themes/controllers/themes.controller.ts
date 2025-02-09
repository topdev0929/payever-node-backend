import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  AclActionsEnum,
  Acl,
} from '@pe/nest-kit';
import { BusinessSchemaName } from '@pe/business-kit';

import { BusinessLocalDocument as BusinessModel } from '../../projections/models';

import { UpdateThemeDto } from '../dto';
import { ThemeModel } from '../models';
import { ThemeService } from '../services';
import { ThemeSchemaName } from '../schemas';

@Controller(`business/:businessId/themes`)
@ApiTags('themes')
export class ThemesController {
  constructor(
    private readonly themeService: ThemeService,
  ) { }

  @Get()
  public async getThemes(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @Param('businessId') swaggerBusinessId: string,
  ): Promise<{ currentTheme: string; themes: ThemeModel[] }> {
    return this.themeService.find(business);
  }

  @Patch(':themeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(RolesEnum.admin, RolesEnum.merchant)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async editTheme(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @Param('businessId') swaggerBusinessId: string,
    @ParamModel(':themeId', ThemeSchemaName, true) theme: ThemeModel,
    @Param('themeId') swaggerThemeId: string,
    @Body() dto: UpdateThemeDto,
  ): Promise<ThemeModel> {
    return this.themeService.update(theme, dto);
  }
}
