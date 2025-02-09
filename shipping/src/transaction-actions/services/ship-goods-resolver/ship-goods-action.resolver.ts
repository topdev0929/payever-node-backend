import { GetTransactionActionsDto } from '../../dto';
import { PaymentOptionTypesEnum } from '../../enums';
import {
  ShipGoodsStrategyInterface,
  TimeLimitedSpecificStatusStrategy,
  TimeLimitedPayeverStatusStrategy,
  SpecificStatusStrategy,
  PayeverStatusStrategy,
} from './strategies';

export class ShipGoodsActionResolver {

  public canShipGoods(transactionDto: GetTransactionActionsDto): boolean {
    const strategy: ShipGoodsStrategyInterface = this.getStrategy(transactionDto);

    return strategy
      ? strategy.canShipGoods(transactionDto)
      : false;
  }

  private getStrategy(transactionDto: GetTransactionActionsDto): ShipGoodsStrategyInterface {

    switch (transactionDto.payment_option.type) {
      case PaymentOptionTypesEnum.SANTANDER_DE_POS_INSTALLMENT:
      case PaymentOptionTypesEnum.SANTANDER_DE_INSTALLMENT:
      case PaymentOptionTypesEnum.SANTANDER_DE_CCP_INSTALLMENT:
        return new TimeLimitedSpecificStatusStrategy(3, 'STATUS_SANTANDER_APPROVED');
      case PaymentOptionTypesEnum.SANTANDER_DE_INVOICE:
      case PaymentOptionTypesEnum.SANTANDER_DE_POS_INVOICE:
        return new TimeLimitedPayeverStatusStrategy(6, 'STATUS_ACCEPTED');
      case PaymentOptionTypesEnum.SANTANDER_DE_POS_FACTORING:
      case PaymentOptionTypesEnum.SANTANDER_DE_FACTORING:
        return new TimeLimitedPayeverStatusStrategy(9, 'STATUS_ACCEPTED');
      case PaymentOptionTypesEnum.SANTANDER_DK_INSTALLMENT:
      case PaymentOptionTypesEnum.SANTANDER_DK_POS_INSTALLMENT:
      case PaymentOptionTypesEnum.SANTANDER_NO_INSTALLMENT:
      case PaymentOptionTypesEnum.SANTANDER_NO_POS_INSTALLMENT:
      case PaymentOptionTypesEnum.SANTANDER_NO_INVOICE:
      case PaymentOptionTypesEnum.SANTANDER_NO_POS_INVOICE:
      case PaymentOptionTypesEnum.SANTANDER_SE_INSTALLMENT:
      case PaymentOptionTypesEnum.SANTANDER_SE_POS_INSTALLMENT:
        return new SpecificStatusStrategy('SIGNED');
      case PaymentOptionTypesEnum.PAYEX_CREDIT_CARD:
      case PaymentOptionTypesEnum.PAYEX_FAKTURA:
      case PaymentOptionTypesEnum.PAYPAL:
      case PaymentOptionTypesEnum.STRIPE_CREDIT_CARD:
      case PaymentOptionTypesEnum.STRIPE_DIRECT_DEBIT:
      case PaymentOptionTypesEnum.SOFORT:
        return new PayeverStatusStrategy('STATUS_ACCEPTED');
      case PaymentOptionTypesEnum.INSTANT_PAYMENT:
        return new PayeverStatusStrategy('STATUS_PAID');
    }
  }
}
