import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import {
  PaymentMethodInterface,
  PaymentMethodLimitsInterface,
  PaymentMethodOptionsInterface,
} from '../../../common/interfaces';

export class PaymentMethodDto implements PaymentMethodInterface {
  @IsBoolean()
  @Expose()
  public readonly accept_fee: boolean;

  @IsString()
  @Expose()
  public readonly description_fee: string;

  @IsString()
  @Expose()
  public readonly description_offer: string;

  @IsNumber()
  @Expose()
  public readonly fixed_fee: number;

  @IsString()
  @Expose()
  public readonly instruction_text: string;

  @IsNumber()
  @Exclude()
  public max: number;

  @IsArray()
  @Expose()
  public readonly merchant_allowed_countries: string[];

  @IsNumber()
  @Expose()
  public min: number;

  @IsString()
  @Expose()
  public readonly name: string;

  @Expose()
  public readonly options: PaymentMethodOptionsInterface;

  @IsString()
  @Expose()
  public readonly payment_method: string;

  @IsString()
  @Expose()
  public readonly payment_issuer?: string;

  @IsString()
  @Expose()
  public readonly related_country: string;

  @IsString()
  @Expose()
  public readonly related_country_name: string;

  @IsString()
  @Expose()
  public readonly status: string;

  @IsString()
  @Expose()
  public readonly thumbnail1: string;

  @IsString()
  @Expose()
  public readonly thumbnail2: string;

  @IsNumber()
  @Expose()
  public readonly variable_fee: number;

  @Expose()
  public amount_limits: PaymentMethodLimitsInterface;

  @IsBoolean()
  @Expose()
  public shipping_address_allowed: boolean;

  @IsBoolean()
  @Expose()
  public shipping_address_equality: boolean;

  @IsBoolean()
  @Expose()
  public is_redirect_method?: boolean;

  @IsBoolean()
  @Expose()
  public is_submit_method?: boolean;

  @IsBoolean()
  @Expose()
  public is_b2b_method?: boolean;

  @IsBoolean()
  @Expose()
  public rates: boolean;

  @IsBoolean()
  @Expose()
  public share_bag_enabled: boolean;
}
