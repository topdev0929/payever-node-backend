import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { CreatePaymentAddressDto } from './create-payment-address.dto';
import { TwoFactorTypeEnum, VerifyTypeEnum, PaymentMethodEnum } from '../../../../enum';

export class CreatePaymentWrapperDto {
  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  @IsEnum(PaymentMethodEnum, { groups: ['create', 'submit', 'link']})
  @ValidateIf((o: CreatePaymentWrapperDto) => !!o.payment_method, { groups: ['create']})
  public payment_method: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public channel: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public channel_type?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public channel_source?: string;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  @Transform((value: any) => (value ? Number(value) : null))
  public channel_set_id: number;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit']})
  @Max(99999999.99, { groups: ['create', 'submit']})
  @Min(0, { groups: ['create', 'submit']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @Type(() => Number)
  public amount: number;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit']})
  @Min(0, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  @Type(() => Number)
  public fee: number;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  public cart: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @Type(() => String)
  public order_id: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  public currency: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public salutation: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  public first_name: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  public last_name: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  public street: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  @ValidateIf((o: CreatePaymentWrapperDto) => !!o.street_number, { groups: ['create', 'submit']})
  @Length(0, 10, { groups: ['create', 'submit']})
  public street_number: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  public zip: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  @ValidateIf((o: CreatePaymentWrapperDto) => o.country !== '')
  @Length(2, 2, { groups: ['create', 'submit']})
  public country: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public region?: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  public city: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public address_line_2: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public social_security_number?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  public birthdate: Date;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public phone: string;

  @ApiProperty()
  @IsNotEmpty({ groups: ['submit']})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsEmail({ }, { groups: ['create', 'submit']})
  @ValidateIf((o: CreatePaymentWrapperDto) => o.email !== '', { groups: ['create']})
  public email: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @IsUrl({ }, { groups: ['create', 'submit']})
  public success_url: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @IsUrl({ }, { groups: ['create', 'submit']})
  public pending_url: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @IsUrl({ }, { groups: ['create', 'submit']})
  public failure_url: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @IsUrl({ }, { groups: ['create', 'submit']})
  public cancel_url: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @IsUrl({ }, { groups: ['create', 'submit']})
  public notice_url: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @IsUrl({ }, { groups: ['create', 'submit']})
  public customer_redirect_url: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @IsUrl({ }, { groups: ['create', 'submit']})
  public x_frame_host: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public plugin_version?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public variant_id?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  public allow_cart_step?: boolean;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  public use_inventory?: boolean;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  public expires_at?: Date;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  public extra?: any;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  @Type(() => CreatePaymentAddressDto)
  public shipping_address?: CreatePaymentAddressDto;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public locale?: string;

  @ApiProperty()
  @IsOptional({ groups: ['create', 'submit']})
  public payment_data?: any;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  public reusable?: boolean;

  @ApiProperty({ required: false})
  @IsString({ groups: ['client_ip_required'] })
  @IsNotEmpty({ groups: ['client_ip_required'] })
  public client_ip?: string;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit']})
  public skip_handle_payment_fee?: boolean;

  @IsEnum(VerifyTypeEnum, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public verify_type?: VerifyTypeEnum;

  @IsEnum(TwoFactorTypeEnum, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public verify_two_factor?: TwoFactorTypeEnum;

  @ApiProperty({ required: false})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public log_level?: any;
}
