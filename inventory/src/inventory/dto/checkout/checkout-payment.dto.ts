import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CheckoutPaymentStatusEnum } from '../../enums';
import { CheckoutFlowDto } from './checkout-flow.dto';

export class CheckoutPaymentDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsOptional()
  @IsEnum(CheckoutPaymentStatusEnum)
  public status: CheckoutPaymentStatusEnum;

  @IsDefined()
  @ValidateNested()
  @Type(() => CheckoutFlowDto)
  public payment_flow: CheckoutFlowDto;
}
