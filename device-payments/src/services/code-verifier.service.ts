import { forwardRef, Inject, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractCollector, Collector } from '@pe/nest-kit';

import { DeliveryService } from '.';
import { CodeVerifyDto } from '../dto';
import { CodeStatus, VerificationStep, VerificationType } from '../enum';
import {
  CodeVerificationResponseInterface,
  CodeVerificationStrategyInterface,
  PaymentCode,
  PaymentCodeModel,
  TransactionsClientParameters,
} from '../interfaces';

@Injectable()
@Collector('verification-strategy')
export class CodeVerifierService extends AbstractCollector {
  constructor(
    @Inject(forwardRef(() => DeliveryService))
    private readonly deliveryService: DeliveryService,
    private readonly logger: Logger,

    @InjectModel('PaymentCode')
    private readonly paymentCodeModel: PaymentCodeModel,
  ) {
    super();
  }

  public async verify(
    dto: CodeVerifyDto,
    userAgent: string,
  ): Promise<CodeVerificationResponseInterface> {
    const code: PaymentCode = await this.paymentCodeModel.findOneBy({
      code: dto.code,
      'flow.businessId': dto.merchant_id,
    });

    await code.checkAmount(dto.amount);
    if (code.status === CodeStatus.accepted && dto.amount < code.flow.amount) {
      await code.updateAmount(dto.amount);
    }

    const strategy: CodeVerificationStrategyInterface = this.getStrategy(
      code.log.verificationType,
      code.log.verificationStep,
      code.log.secondFactor,
    );

    const verificationResult: CodeVerificationResponseInterface = await strategy.verify(
      dto,
      code,
    );
    verificationResult.amount = dto.amount;

    const transactionClientParameters: TransactionsClientParameters = {
      businessId: dto.merchant_id,
      oauthToken: dto.token,
      paymentUuid: code.flow.payment.uuid,
      userAgent,
    };

    this.deliveryService.init(
      code.log.verificationType,
      transactionClientParameters,
    );
    if (
      code.status === CodeStatus.paid &&
      await this.deliveryService.isDeliveryAllowed()
    ) {
      await this.deliveryService.deliver(dto.shipping_goods_data);
    }

    await code.save();

    return verificationResult;
  }

  private getStrategy(
    type: VerificationType,
    step: VerificationStep,
    factor: boolean,
  ): CodeVerificationStrategyInterface | never {
    for (const strategy of this.services) {
      if (!CodeVerifierService.isVerificationStrategy(strategy)) {
        throw new RuntimeException(
          `Wrong service marked as a verification strategy: ${
            strategy.constructor.name
          }`,
        );
      }

      if (
        strategy.type === type &&
        strategy.step === step &&
        strategy.factor === factor
      ) {
        return strategy;
      }
    }

    const parameters: string = JSON.stringify({ type, step, factor });
    throw new UnprocessableEntityException(
      'No appropriate strategy found to verify the code with parameters: ' +
        parameters,
    );
  }

  private static isVerificationStrategy(
    service: any,
  ): service is CodeVerificationStrategyInterface {
    return 'function' === typeof service.verify;
  }
}
