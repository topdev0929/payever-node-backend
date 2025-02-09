import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

import { PaymentSource } from '../../enum';

export class PaymentCodeCreateDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(PaymentSource)
  public source?: PaymentSource;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public amount?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public paymentFlowId?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  @Transform((value: string) => (value ? value.replace(/[^+\d]/g, '') : null))
  public phoneNumber?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public sellerEmail: string;

  @Allow()
  public asData = (): any => {
    const result: any = { flow: { } };

    if (this.sellerEmail) {
      result.sellerEmail = this.sellerEmail;
    }

    if (this.source) {
      result.log = { source: this.source };
    }

    if (this.amount) {
      result.flow.amount = this.amount;
    }

    if (this.paymentFlowId) {
      result.flow.id = this.paymentFlowId;
    }

    if (this.phoneNumber) {
      result.flow.billingAddress = { phone: this.phoneNumber };
    }

    return result;
  };
}
