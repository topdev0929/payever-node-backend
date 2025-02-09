import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  AccessTokenPayload,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  TokensResultModel,
  User,
} from '@pe/nest-kit';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessModel } from '../models/business.model';
import { AppointmentNetworkService } from '../services/appointment-network.service';
import { AppointmentNetworkModel } from '../models/appointment-network.model';
import { AppointmentNetworkDto, AppWithAccessConfigDto, IsValidNameDto } from '../dto';

import { AppointmentNetworkSchemaName } from '../schemas';
import { ValidateAppointmentNameResponseInterface } from '../interfaces';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const BUSINESS_ID: string = ':businessId';
const MICROSERVICE: string = 'appointments';

@Controller('business/:businessId/appointment-network')
@ApiTags('appointment-network')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class AppointmentNetworkController extends AbstractController {
  constructor(
    private readonly appointmentNetworkService: AppointmentNetworkService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  public async getAppointmentNetwork(
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AppointmentNetworkModel[]> {
    return this.appointmentNetworkService.getByBusiness(business);
  }

  @Get('/:appointmentNetworkId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  public async getAppointmentNetworkById(
    @ParamModel(':appointmentNetworkId', AppointmentNetworkSchemaName, true)
    appointmentNetwork: AppointmentNetworkModel,
  ): Promise<AppWithAccessConfigDto> {
    return this.appointmentNetworkService.appWithAccessConfig(appointmentNetwork._id);
  }

  @Get('/default')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  public async getDefaultAppointmentNetwork(
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AppointmentNetworkModel> {
    return this.appointmentNetworkService.getDefault(business);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.create })
  public async createAppointmentNetwork(
    @Body() createAppointmentNetworkDto: AppointmentNetworkDto,
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AppointmentNetworkModel> {
    return this.appointmentNetworkService.create(business, createAppointmentNetworkDto);
  }

  @Patch('/:appointmentNetworkId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.update })
  public async updateAppointmentNetwork(
    @Body() updateAppointmentNetworkDto: AppointmentNetworkDto,
    @ParamModel(':appointmentNetworkId', AppointmentNetworkSchemaName, true)
    appointmentNetwork: AppointmentNetworkModel,
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AppointmentNetworkModel> {
    return this.appointmentNetworkService.update(appointmentNetwork, updateAppointmentNetworkDto, business);
  }

  @Patch('/:appointmentNetworkId/default')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.update })
  public async setAppointmentNetworkAsDefault(
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModel,
    @ParamModel(':appointmentNetworkId', AppointmentNetworkSchemaName, true)
    appointmentNetwork: AppointmentNetworkModel,
  ): Promise<AppointmentNetworkModel> {
    return this.appointmentNetworkService.setDefault(appointmentNetwork._id, business._id);
  }

  @Delete('/:appointmentNetworkId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.delete })
  public async deleteAppointmentNetwork(
    @User() user: AccessTokenPayload,
    @ParamModel(':appointmentNetworkId', AppointmentNetworkSchemaName, true)
    appointmentNetwork: AppointmentNetworkModel,
  ): Promise<void> {

    return this.appointmentNetworkService.delete(appointmentNetwork);
  }

  @Get('isValidName')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: MICROSERVICE, action: AclActionsEnum.read })
  public async isValidName(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() isValidNameDto: IsValidNameDto,
  ): Promise<ValidateAppointmentNameResponseInterface> {
    return this.appointmentNetworkService.isNetworkNameAvailable(isValidNameDto.name, business, null);
  }
}
