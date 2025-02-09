import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import {
  JwtAuthGuard,
  OrganizationTokenInterface,
  Roles,
  RolesEnum,
  User,
} from '@pe/nest-kit';
import { ClientResultDto, OnboardingRequestDto, UninstallPaymentMethodDto } from '../dto';
import { OrganizationBusinessModel } from '../models';
import { PSPService } from '../services';
import { PaymentMethodDto } from '../dto/onboarding/payment-method.dto';

@Controller('psp')
@ApiTags('psp')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.organization)
@ApiBearerAuth()
export class PSPController {
  constructor(
    private readonly pspService: PSPService,
  ) { }

  @Get()
  public async getBusinesses(
    @User() org: OrganizationTokenInterface,
  ): Promise<OrganizationBusinessModel[]> {
    return this.pspService.getBusinesses(org);
  }

  @Get(':businessId')
  public async getBusinessesById(
    @Param('businessId') businessId: string,
  ): Promise<OrganizationBusinessModel[]> {
    return this.pspService.getBusinessById(businessId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ClientResultDto,
  })
  public async addBusiness(
    @User() org: OrganizationTokenInterface,
    @Body() setupDto: OnboardingRequestDto,
  ): Promise<ClientResultDto> {
    return this.pspService.createBusiness(org, setupDto);
  }

  @Post(':businessId/payment-method')
  @HttpCode(HttpStatus.OK)
  public async installPaymentMethod(
    @Param('businessId') businessId: string,
    @Body() dto: PaymentMethodDto,
  ): Promise<ClientResultDto> {
    return this.pspService.installPaymentMethod(businessId, dto);
  }

  @Delete(':businessId/payment-method')
  public async uninstallPaymentMethod(
    @Param('businessId') businessId: string,
    @Body() dto: UninstallPaymentMethodDto,
  ): Promise<ClientResultDto> {
    return this.pspService.uninstallPaymentMethod(businessId, dto);
  }

  @Delete(':businessId')
  public async remvoeBusiness(
    @User() org: OrganizationTokenInterface,
    @Param('businessId') businessId: string,
  ): Promise<void> {
    return this.pspService.removeBusiness(org, businessId);
  }
}
