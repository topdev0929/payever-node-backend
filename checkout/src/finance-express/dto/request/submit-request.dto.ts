import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { SubmitPaymentRequestDto } from './submit-payment-request.dto';

export class SubmitRequestDto {
  @ApiProperty({ required: true})
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SubmitPaymentRequestDto)
  public payment: SubmitPaymentRequestDto;
}
