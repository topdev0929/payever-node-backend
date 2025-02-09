import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, Business, JwtAuthGuard, Roles, RolesEnum, User } from '@pe/nest-kit';
import { FastifyRequest } from 'fastify';
import { OauthService } from '../../../common/services';
import { HeadersHolderDto } from '../../dto';
import { LegacyApiResponseTransformerService, ExternalApiExecutor } from '../../services';
import { PaymentDataHelper } from '../../helpers';
import {
  AttachPurchaserAddressRequestDto,
  CompanyCreditLineRequestDto,
  CompanySearchRequestDto,
  DeactivatePurchaserRequestDto,
  DeletePurchaserRequestDto,
  OnboardPurchaserRequestDto,
  TriggerPurchaserVerificationRequestDto,
  UpdatePurchaserRequestDto,
} from '../../dto/request/v1';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';

@Controller('b2b')
@ApiTags('B2B api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class B2bController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly externalApiExecutor: ExternalApiExecutor,
    private readonly responseTransformer: LegacyApiResponseTransformerService,
  ) { }

  @Post('/search')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CompanySearchRequestDto })
  @Roles(RolesEnum.oauth)
  public async searchCompany(
    @Body() dto: any,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<any> {
    try {
      const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
      const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

      return this.externalApiExecutor.externalCompanySearch(dto, headersHolder, businessId);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'search');
    }
  }

  @Post('/search/credit')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CompanyCreditLineRequestDto })
  @Roles(RolesEnum.oauth)
  public async getCompanyCreditLine(
    @Body() dto: CompanyCreditLineRequestDto,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<any> {
    try {
      const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
      const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

      return this.externalApiExecutor.externalGetCompanyCreditLine(dto, headersHolder, businessId);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'credit');
    }
  }

  @Post('/onboarding/purchaser')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: OnboardPurchaserRequestDto })
  @Roles(RolesEnum.oauth)
  public async onboardPurchaser(
    @Body() dto: OnboardPurchaserRequestDto,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<any> {
    try {
      const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
      const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

      return this.externalApiExecutor.externalOnboardPurchaser(dto, headersHolder, businessId);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'onboarding');
    }
  }

  @Patch('/onboarding/purchaser')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: OnboardPurchaserRequestDto })
  @Roles(RolesEnum.oauth)
  public async updatePurchaser(
    @Body() dto: UpdatePurchaserRequestDto,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<any> {
    try {
      const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
      const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

      return this.externalApiExecutor.externalUpdatePurchaser(dto, headersHolder, businessId);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'onboarding');
    }
  }

  @Delete('/onboarding/purchaser')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: DeletePurchaserRequestDto })
  @Roles(RolesEnum.oauth)
  public async deletePurchaser(
    @Body() dto: DeletePurchaserRequestDto,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<any> {
    try {
      const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
      const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

      return this.externalApiExecutor.externalDeletePurchaser(dto, headersHolder, businessId);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'onboarding');
    }
  }

  @Patch('/onboarding/purchaser/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: DeactivatePurchaserRequestDto })
  @Roles(RolesEnum.oauth)
  public async deactivatePurchaser(
    @Body() dto: DeactivatePurchaserRequestDto,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<any> {
    try {
      const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
      const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

      return this.externalApiExecutor.externalDeactivatePurchaser(dto, headersHolder, businessId);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'onboarding');
    }
  }

  @Post('/onboarding/address')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: AttachPurchaserAddressRequestDto })
  @Roles(RolesEnum.oauth)
  public async attachPurchaserAddress(
    @Body() dto: AttachPurchaserAddressRequestDto,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<any> {
    try {
      const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
      const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

      return this.externalApiExecutor.externalAttachPurchaserAddress(dto, headersHolder, businessId);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'onboarding');
    }
  }

  @Post('/onboarding/verify')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: AttachPurchaserAddressRequestDto })
  @Roles(RolesEnum.oauth)
  public async triggerPurchaserVerification(
    @Body() dto: TriggerPurchaserVerificationRequestDto,
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
  ): Promise<any> {
    try {
      const businessId: string = this.oauthService.getOauthUserBusiness(user, targetBusinessId);
      const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(req);

      return this.externalApiExecutor.externalTriggerPurchaserVerification(dto, headersHolder, businessId);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'onboarding');
    }
  }
}
