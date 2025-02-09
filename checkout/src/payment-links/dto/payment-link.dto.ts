import { CreatePaymentDto } from '../../legacy-api/dto/request/common';

export class PaymentLinkDto extends CreatePaymentDto {
  public business_id: string;
  public is_deleted: boolean;
}
