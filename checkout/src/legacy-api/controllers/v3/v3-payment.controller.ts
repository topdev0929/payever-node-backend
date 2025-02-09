import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, Business, JwtAuthGuard, Roles, RolesEnum, User } from '@pe/nest-kit';
import { plainToClass } from 'class-transformer';
import { FastifyRequest } from 'fastify';
import { ApiCallResultDto } from '../../dto';
import { LegacyApiProcessor } from '../../services';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { CreatePaymentWrapperDto } from '../../dto/request/v3';

@Controller('v3/payment')
@ApiTags('legacy-api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class V3PaymentController {
  constructor(
    private readonly legacyApiProcessor: LegacyApiProcessor,
  ) { }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.oauth)
  @ApiBody({ type: CreatePaymentWrapperDto})
  public async createPayment(
    @Req() request: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
    @Body() dto: any,
  ): Promise<ApiCallResultDto> {
    let paymentDto: CreatePaymentWrapperDto = plainToClass(CreatePaymentWrapperDto, dto);
    if (!paymentDto) {
      paymentDto = new CreatePaymentWrapperDto();
    }

    return this.legacyApiProcessor.processV3CreateOrSubmitPayment({ request, targetBusinessId, user }, paymentDto);
  }

  @Post('/submit')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.oauth)
  @ApiBody({ type: CreatePaymentWrapperDto})
  public async submitPayment(
    @Req() request: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Business() targetBusinessId: string,
    @Body() dto?: any,
  ): Promise<ApiCallResultDto> {
    let paymentDto: CreatePaymentWrapperDto = plainToClass(CreatePaymentWrapperDto, dto);
    if (!paymentDto) {
      paymentDto = new CreatePaymentWrapperDto();
    }

    return this.legacyApiProcessor.processV3SubmitPayment({ request, targetBusinessId, user }, paymentDto);
  }
}
