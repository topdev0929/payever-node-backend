import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsNotEmpty, IsNumberString } from 'class-validator';
import { CommonPaymentDto } from './common-payment.dto';

export class PaymentDto extends CommonPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Transform((value: string) => (value ? value.replace(/[^+\d]/g, '') : null))
  public phone_number: string;

  @Allow()
  public asData(): any {
    const result: any = super.asData();

    if (this.phone_number) {
      result.flow.billingAddress.phone = this.phone_number;
    }

    return result;
  }
}
