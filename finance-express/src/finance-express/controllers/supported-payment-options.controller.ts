import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { PaymentOptionsEnum } from '../enums';

@Controller('supported-payment-options')
@UseGuards(JwtAuthGuard)
@ApiTags('finance-express')
@Roles(RolesEnum.anonymous)
export class SupportedPaymentOptionsController extends AbstractController {
  constructor(
  ) {
    super();
  }

  @Get()
  public async getSupportedPaymentOptions(
  ): Promise<string[]> {
    return Object.values(PaymentOptionsEnum);
  }
}
