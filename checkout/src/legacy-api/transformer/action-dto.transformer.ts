import { plainToClass } from 'class-transformer';
import {
  AuthorizeActionDto,
  CancelActionDto,
  ClaimActionDto,
  ClaimCancelActionDto,
  ClaimUploadActionDto,
  EditActionDto,
  InvoiceActionDto,
  RefundActionDto,
  SettleActionDto,
  ShippingGoodsActionDto,
  VerifyActionDto,
} from '../dto/request/v1';
import { PaymentActionsEnum } from '../enum';

export class ActionDtoTransformer {
  public static actionToRequestDTO(action: string, dto: object): object {
    switch (action) {
      case PaymentActionsEnum.REFUND:
        return plainToClass(RefundActionDto, dto);

      case PaymentActionsEnum.CANCEL:
        return plainToClass(CancelActionDto, dto);

      case PaymentActionsEnum.EDIT:
        return plainToClass(EditActionDto, dto);

      case PaymentActionsEnum.SHIPPED:
      case PaymentActionsEnum.SHIPPING_GOODS:
        return plainToClass(ShippingGoodsActionDto, dto);

      case PaymentActionsEnum.AUTHORIZE:
        return plainToClass(AuthorizeActionDto, dto);

      case PaymentActionsEnum.VERIFY:
        return plainToClass(VerifyActionDto, dto);

      case PaymentActionsEnum.CLAIM:
        return plainToClass(ClaimActionDto, dto);

      case PaymentActionsEnum.CLAIM_UPLOAD:
        return plainToClass(ClaimUploadActionDto, dto);

      case PaymentActionsEnum.CLAIM_CANCEL:
        return plainToClass(ClaimCancelActionDto, dto);

      case PaymentActionsEnum.SETTLE:
        return plainToClass(SettleActionDto, dto);

      case PaymentActionsEnum.INVOICE:
        return plainToClass(InvoiceActionDto, dto);
    }
  }
}
