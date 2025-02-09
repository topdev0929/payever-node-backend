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
  NotFoundException,
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
} from '@pe/nest-kit';
import { BusinessSchemaName, BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../models/business.model';
import { AppointmentNetworkService } from '../services/appointment-network.service';
import { AppointmentNetworkModel } from '../models/appointment-network.model';
import { AdminAppointmentNetworkDto, AdminIsValidNameDto, AppointmentNetworkDto, AppWithAccessConfigDto } from '../dto';
import { AppointmentNetworkSchemaName } from '../schemas';
import { ValidateAppointmentNameResponseInterface } from '../interfaces';
import { AppointmentNetworkQueryDto } from '../dto/appointment-network-query.dto';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const BUSINESS_ID: string = ':businessId';
const MICROSERVICE: string = 'appointments';

@Controller('admin/appointment-network')
@ApiTags('admin appointment-network')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
@ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: '' })
export class AdminAppointmentNetworkController extends AbstractController {
  constructor(
    private readonly appointmentNetworkService: AppointmentNetworkService,
    private readonly businessService: BusinessService,
  ) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAppointmentNetwork(
    @Query() query: AppointmentNetworkQueryDto,
  ): Promise<any> {
    return this.appointmentNetworkService.getForAdmin(query);
  }

  @Get('/:appointmentNetworkId')
  @HttpCode(HttpStatus.OK)
  public async getAppointmentNetworkById(
    @ParamModel(':appointmentNetworkId', AppointmentNetworkSchemaName, true)
    appointmentNetwork: AppointmentNetworkModel,
  ): Promise<AppWithAccessConfigDto> {
    return this.appointmentNetworkService.appWithAccessConfig(appointmentNetwork._id);
  }

  @Get('/default/business/:businessId')
  @HttpCode(HttpStatus.OK)
  public async getDefaultAppointmentNetwork(
    @ParamModel(BUSINESS_ID, BusinessSchemaName, true) business: BusinessModel,
  ): Promise<AppointmentNetworkModel> {
    return this.appointmentNetworkService.getDefault(business);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async createAppointmentNetwork(
    @Body() adminAppointmentNetworkDto: AdminAppointmentNetworkDto,
  ): Promise<AppointmentNetworkModel> {
    const businessId: string = adminAppointmentNetworkDto.businessId;
    const business: any = await this.businessService.findOneById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }

    return this.appointmentNetworkService.create(business, adminAppointmentNetworkDto);
  }

  @Patch('/:appointmentNetworkId')
  @HttpCode(HttpStatus.OK)
  public async updateAppointmentNetwork(
    @Body() updateAppointmentNetworkDto: AppointmentNetworkDto,
    @ParamModel(':appointmentNetworkId', AppointmentNetworkSchemaName, true)
    appointmentNetwork: AppointmentNetworkModel,
  ): Promise<AppointmentNetworkModel> {
    const businessId: any = appointmentNetwork.business;
    const business: any = await this.businessService.findOneById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }
    
    return this.appointmentNetworkService.update(appointmentNetwork, updateAppointmentNetworkDto, business);
  }

  @Patch('/:appointmentNetworkId/set-default')
  @HttpCode(HttpStatus.OK)
  public async setAppointmentNetworkAsDefault(
    @ParamModel(':appointmentNetworkId', AppointmentNetworkSchemaName, true)
    appointmentNetwork: AppointmentNetworkModel,
  ): Promise<AppointmentNetworkModel> {
    const businessId: any = appointmentNetwork.business;
    const business: any = await this.businessService.findOneById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }
    
    return this.appointmentNetworkService.setDefault(appointmentNetwork._id, business._id);
  }

  @Delete('/:appointmentNetworkId')
  @HttpCode(HttpStatus.OK)
  public async deleteAppointmentNetwork(
    @ParamModel(':appointmentNetworkId', AppointmentNetworkSchemaName, true)
    appointmentNetwork: AppointmentNetworkModel,
  ): Promise<void> {
    return this.appointmentNetworkService.delete(appointmentNetwork);
  }

  @Get('is-valid-name')
  @HttpCode(HttpStatus.OK)
  public async isValidName(
    @Query() isValidNameDto: AdminIsValidNameDto,
  ): Promise<ValidateAppointmentNameResponseInterface> {
    const businessId: any = isValidNameDto.businessId;
    const business: any = await this.businessService.findOneById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }
    
    return this.appointmentNetworkService.isNetworkNameAvailable(isValidNameDto.name, business, null);
  }
}
