import { BadRequestException, Injectable } from '@nestjs/common';
import * as qr from 'qr-image';

import { PaymentQrDto } from '../dto';
import { PaymentSource, VerificationType } from '../enum';
import { BusinessModel, PaymentCode } from '../interfaces';
import { PaymentUrlGenerator } from './payment-url.generator';
import { PaymentService } from './payment.service';

@Injectable()
export class QrService {
  constructor(
    private readonly paymentService: PaymentService,
  ) {
  }

  public async generate(business: BusinessModel, qrDto: PaymentQrDto): Promise<string> {
    if (
      business.settings.secondFactor === true
      && business.settings.verificationType === VerificationType.verifyByPayment
      && !qrDto.address.phone_number
    ) {
      throw new BadRequestException('Phone number is required to use this payment verification method');
    }

    const paymentCode: PaymentCode =
      await this.paymentService.createPaymentCodeByBusiness(business, PaymentSource.qr, qrDto);
    const url: string = PaymentUrlGenerator.generateRestoreFromCodeUrl(paymentCode._id);

    return qr.imageSync(url).toString('base64');
  }
}
