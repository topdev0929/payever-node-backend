import { Body, Controller, Get, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AbstractController, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { FastifyRequest } from 'fastify';
import { CodeVerifyDto, CodeVerifyResultDto, PaymentDto, PaymentQrDto } from '../dto';
import { PaymentSource } from '../enum';
import { BusinessModel, CodeVerificationResponseInterface, PaymentCode } from '../interfaces';
import { BusinessSchemaName } from '../schemas';
import { CodeVerifierService, CommunicationsService, PaymentService, QrService, ValidatorService } from '../services';
import { BusinessVoter } from '../voters';

@Controller('/api/v1')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.oauth)
export class ApiController extends AbstractController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly validatorService: ValidatorService,
    private readonly communicationsService: CommunicationsService,
    private readonly codeVerificator: CodeVerifierService,
    private readonly qrService: QrService,
  ) {
    super();
  }

  @Post('/external/:businessId')
  public async createPayment(
    @Body() dto: PaymentDto,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<{ merchant_id: string; timestamp: Date }> {
    await this.validatorService.checkPayment(business, dto);
    const code: PaymentCode = await this.paymentService.createPaymentCodeByBusiness(
      business,
      PaymentSource.externalApi,
      dto,
    );
    await this.communicationsService.sendPayment(
      business._id,
      dto,
      code,
    );

    return {
      merchant_id: business._id,
      timestamp: code.createdAt,
    };
  }

  @Get('/external/code/check')
  @ApiResponse({
    description: 'Invalid credentials',
    status: HttpStatus.UNAUTHORIZED,
  })
  @ApiResponse({
    description: 'Code verification result',
    status: HttpStatus.OK,
    type: CodeVerifyResultDto,
  })
  public async verifyCodeAsGet(
    @Req() request: FastifyRequest,
    @Query() dto: CodeVerifyDto,
  ): Promise<CodeVerificationResponseInterface> {
    return this.verifyCodeAsPost(request, dto);
  }

  @Post('/external/code/check')
  @ApiResponse({
    description: 'Invalid credentials',
    status: HttpStatus.UNAUTHORIZED,
  })
  @ApiResponse({
    description: 'Code verification result',
    status: HttpStatus.OK,
    type: CodeVerifyResultDto,
  })
  public async verifyCodeAsPost(
    @Req() request: FastifyRequest,
    @Body() dto: CodeVerifyDto,
  ): Promise<CodeVerificationResponseInterface> {
    await this.denyAccessUnlessGranted(
      BusinessVoter.businessAccess,
      dto.merchant_id,
      request,
    );

    return this.codeVerificator.verify(dto, request.headers['user-agent']);
  }

  @Post('/generate-qr/:businessId')
  @ApiResponse({
    description: 'Invalid credentials',
    status: HttpStatus.UNAUTHORIZED,
  })
  @ApiResponse({
    description: 'returns base64 encoded QR image',
    status: HttpStatus.OK,
  })
  public async qr(
    @Body() qrDto: PaymentQrDto,
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<string> {
    return this.qrService.generate(business, qrDto);
  }
}
