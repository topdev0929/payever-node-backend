import { Exclude, Expose } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';
import { ApiCallResponseInterface } from '../../interfaces';
import { PaymentModel } from '../../models';

@Exclude()
export class ApiCallPaymentActionDto implements ApiCallResponseInterface{
  @IsString()
  @Expose()
  public readonly id: string;

  @IsString()
  @Expose()
  public readonly status: string = 'success';

  @IsDateString()
  @Expose()
  public readonly created_at: Date;

  @IsString()
  @Expose()
  public readonly business_id: string;

  @IsString()
  @Expose()
  public readonly payment_id: string;

  @IsString()
  @Expose()
  public readonly type: string;

  @IsString()
  @Expose()
  public readonly requires_2fa: boolean;

  constructor(
    payment: PaymentModel,
    action: string,
    status?: string,
    requires2FA: boolean = false,
  ) {
    this.id = createHash('md5').update(uuid()).digest('hex');
    this.created_at = new Date();

    this.payment_id = payment.original_id;
    this.business_id = payment.business_uuid;
    this.type = action;
    this.requires_2fa = requires2FA;
    if (status) {
      this.status = status;
    }
  }
}
