import { PaymentSplitTypeEnum } from '../../../legacy-api';
import { PaymentLinkSplitAmountDto } from './payment-link-split-amount.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';

@Exclude()
export class PaymentLinkSplitDto {
  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsEnum(PaymentSplitTypeEnum)
  public type: PaymentSplitTypeEnum;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public identifier?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @Type( () => PaymentLinkSplitAmountDto)
  public amount?: PaymentLinkSplitAmountDto;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public reference?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public description?: string;
}
