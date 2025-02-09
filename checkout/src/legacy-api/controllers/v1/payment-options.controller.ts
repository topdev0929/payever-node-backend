import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { PaymentMethodService } from '../../services';
import { PaymentMethodDto } from '../../dto/response/payment-method.dto';

@Controller('payment-options')
@ApiTags('legacy-api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PaymentOptionsController {
  constructor(
    private readonly paymentMethodService: PaymentMethodService,
  ) { }

  @Get()
  @Roles(RolesEnum.anonymous)
  public async apiCallInfo(
    @Query('_currency') currency: string = 'EUR',
  ): Promise<PaymentMethodDto[]> {
    return this.paymentMethodService.getAllAvailablePaymentMethods(currency);
  }
}
