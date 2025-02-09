import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessService, BusinessSchemaName } from '@pe/business-kit';

import { BusinessInterface } from '../interfaces';
import { BusinessModel } from '../models';
import { EditBusinessDto } from '../dto/edit-business.dto';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
  ) { }

  @Patch(':businessId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  public async patch(
    @Param('businessId') businessId: string,
    @Body() dto: EditBusinessDto,
  ): Promise<BusinessModel> {
    return this.businessService.updateById(businessId, dto) as Promise<BusinessModel>;
  }

  @Get(':businessId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  public async getBusinessById(
    @ParamModel('businessId', BusinessSchemaName, true) business: BusinessInterface,
  ): Promise<BusinessInterface> {
    return business;
  }
}
