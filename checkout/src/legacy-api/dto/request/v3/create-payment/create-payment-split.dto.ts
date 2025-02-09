import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentSplitTypeEnum } from '../../../../enum';
import { CreatePaymentSplitAmountDto } from './create-payment-split-amount.dto';

export class CreatePaymentSplitDto {
  @ApiProperty({ enum: PaymentSplitTypeEnum})
  @IsEnum(PaymentSplitTypeEnum, { groups: ['create', 'submit', 'link']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link']})
  public type: PaymentSplitTypeEnum;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public identifier?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentSplitAmountDto)
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  public amount?: CreatePaymentSplitAmountDto;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public reference?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public description?: string;
}
