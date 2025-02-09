import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean, IsDate, IsDateString } from 'class-validator';
import { PaymentMethodEnum } from '../../../../enum';
import { CustomerTypeEnum } from '../../../../../common/enum';

export class CreatePaymentOptionsDto {
  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public allow_separate_shipping_address?: boolean;

  @ApiProperty({ required: false, enum: CustomerTypeEnum, type: [CustomerTypeEnum]})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @IsEnum(CustomerTypeEnum, { each: true, groups: ['create', 'submit', 'link']})
  public allow_customer_types?: CustomerTypeEnum[];

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public allow_payment_methods?: PaymentMethodEnum[];

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public allow_cart_step?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public allow_billing_step?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public allow_shipping_step?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public use_inventory?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public use_styles?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public use_default_variant?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public use_iframe?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public salutation_mandatory?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public phone_mandatory?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public birthdate_mandatory?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public test_mode?: boolean;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'link', 'submit']})
  public reusable?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public hide_logo?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public hide_imprint?: boolean;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public auto_capture_enabled?: boolean;

  @ApiProperty({ required: false})
  @IsDateString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public auto_capture_date?: Date;

  @ApiProperty({ required: false})
  @IsBoolean({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public disable_validation?: boolean;
}
