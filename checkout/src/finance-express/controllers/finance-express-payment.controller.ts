import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, JwtAuthGuard, Roles, RolesEnum, User } from '@pe/nest-kit';
import { FastifyRequest } from 'fastify';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import {
  HeadersHolderDto,
  PaymentDataHelper,
  PaymentMethodEnum,
} from '../../legacy-api';
import { InitRequestDto, InitResponseDto, SubmitRequestDto } from '../dto';
import { plainToClass } from 'class-transformer';
import { FinanceExpressManager } from '../services';

@Controller('finance-express/:paymentMethod')
@ApiTags('finance-express')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FinanceExpressPaymentController {
  constructor(
    private readonly financeExpressManager: FinanceExpressManager,
  ) { }

  @Post('/init')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.anonymous, RolesEnum.merchant, RolesEnum.guest)
  @ApiBody({ type: InitRequestDto})
  public async createPayment(
    @Req() request: FastifyRequest<any>,
    @Body() initRequestDto: InitRequestDto,
    @Param('paymentMethod') paymentMethod: PaymentMethodEnum,
  ): Promise<InitResponseDto> {
    const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(request);

    return this.financeExpressManager.prepareInitData(headersHolder, paymentMethod, initRequestDto);
  }

  @Post('/pay')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.merchant, RolesEnum.guest)
  public async submitPayment(
    @Req() request: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Body() submitRequest: any,
    @Param('paymentMethod') paymentMethod: PaymentMethodEnum,
  ): Promise<any> {
    submitRequest = plainToClass(SubmitRequestDto, submitRequest);
    const headersHolder: HeadersHolderDto = PaymentDataHelper.prepareHeadersHolderFromRequest(request);

    return this.financeExpressManager.doSubmit(headersHolder, paymentMethod, submitRequest, user);
  }
}
