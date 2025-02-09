import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum, AclActionsEnum, Acl } from '@pe/nest-kit';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BusinessInterface } from '../interfaces';
import { BusinessSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { BusinessModel } from '../models';
import { EditBusinessDto } from '../dto/edit-business.dto';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class BusinessController {
  constructor(
    @InjectModel(BusinessSchemaName)private readonly businessModel: Model<BusinessModel>,
  ) { }

  @Patch(':businessId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  @Acl({ microservice: 'pos', action: AclActionsEnum.update })
  public async patch(
    @Param('businessId') businessId: string,
    @Body() dto: EditBusinessDto,
  ): Promise<BusinessInterface> {
    return this.businessModel.findByIdAndUpdate(businessId, { $set: dto });
  }

  @Get(':businessId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: '' })
  @Acl({ microservice: 'pos', action: AclActionsEnum.read })
  public async get(
    @ParamModel('businessId', BusinessSchemaName, true) business: BusinessInterface,
  ): Promise<BusinessInterface> {
    return business;
  }
}
