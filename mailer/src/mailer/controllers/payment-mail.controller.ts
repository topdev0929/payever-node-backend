import { Controller, Post, Logger, UseGuards } from '@nestjs/common';
import { PaymentMailModel } from '../models';
import { PaymentService } from '../services';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { PaymentMailSchemaName } from '../schemas';
import { plainToClass } from 'class-transformer';
import { PaymentMailDto } from '../dto/payment';

@Controller('/business/:businessId/payment-mail')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@Acl({ microservice: 'transactions', action: AclActionsEnum.create })
export class PaymentMailController {
  constructor(private readonly logger: Logger, private readonly paymentService: PaymentService) { }

  @Post('/:paymentMailId')
  public async resendPaymentMail(
    @ParamModel(
      {
        _id: ':paymentMailId',
      },
      PaymentMailSchemaName,
    )
    paymentMail: PaymentMailModel,
  ): Promise<void> {
    this.logger.log(`Resend payment email "${paymentMail.id}"`);

    paymentMail.eventData = plainToClass<PaymentMailDto, { }>(PaymentMailDto, paymentMail.eventData);

    await this.paymentService.sendPaymentEmail(paymentMail);

    this.logger.log('email re-sent');
  }
}
