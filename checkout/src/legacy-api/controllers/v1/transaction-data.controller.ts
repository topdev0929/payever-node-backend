import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { LegacyApiResponseTransformerService, ExternalApiExecutor } from '../../services';
import { PaymentSchemaName } from '../../../mongoose-schema';
import { PaymentModel } from '../../models';
import { TransactionDataFilterPayloadDto } from '../../dto/request/v1';

@Controller('transaction-data')
@ApiTags('Transaction data')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TransactionDataController {
  constructor(
    private readonly externalApiExecutor: ExternalApiExecutor,
    private readonly responseTransformer: LegacyApiResponseTransformerService,
  ) { }

  @Get(':paymentId')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.admin)
  public async getByPaymentId(
    @ParamModel(
      {
        original_id: ':paymentId',
      },
      PaymentSchemaName,
    ) payment: PaymentModel,
  ): Promise<any> {
    try {
      return this.externalApiExecutor.externalTransactionDataByPayment(payment);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'transaction-data');
    }
  }

  @Get(':paymentMethod/business/:businessId')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.admin)
  public async getByBusinessId(
    @Param('businessId') businessId: string,
    @Param('paymentMethod') paymentMethod: string,
    @Query() filterDto: TransactionDataFilterPayloadDto,
  ): Promise<any> {
    try {
      return this.externalApiExecutor.externalTransactionDataByBusinessId(businessId, paymentMethod, filterDto);
    } catch (e) {
      return this.responseTransformer.failedCustomErrorResponse(e.message, 'transaction-data');
    }
  }
}
