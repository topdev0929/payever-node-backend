import { Exclude, Expose } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';

@Exclude()
export class ApiCallDto {
  @IsString()
  @Expose({ name: '_id' })
  public readonly id: string;

  @IsString()
  @Expose({ name: 'businessId'})
  public readonly business_id: string;

  @IsString()
  @Expose()
  public readonly payment_method: string;

  @IsString()
  @Expose()
  public readonly channel: string;

  @IsString()
  @Expose()
  public readonly channel_set_id: string;

  @IsNumber()
  @Expose()
  public readonly amount: number;

  @IsNumber()
  @Expose()
  public readonly fee: number;

  @Expose()
  public readonly cart: object[];

  @IsString()
  @Expose()
  public readonly order_id: string;

  @IsString()
  @Expose()
  public readonly currency: string;

  @IsString()
  @Expose()
  public readonly salutation: string;

  @IsString()
  @Expose()
  public readonly first_name: string;

  @IsString()
  @Expose()
  public readonly last_name: string;

  @IsString()
  @Expose()
  public readonly street: string;

  @IsString()
  @Expose()
  public readonly city: string;

  @IsString()
  @Expose()
  public readonly zip: string;

  @IsString()
  @Expose()
  public readonly region: string;

  @IsString()
  @Expose()
  public readonly country: string;

  @IsString()
  @Expose()
  public readonly social_security_number: string;

  @IsDateString()
  @Expose()
  public readonly birthdate: Date;

  @IsDateString()
  @Expose({ name: 'createdAt'})
  public readonly created_at: Date;

  @IsString()
  @Expose()
  public readonly phone: string;

  @IsString()
  @Expose()
  public readonly email: string;

  @IsString()
  @Expose()
  public readonly success_url: string;

  @IsString()
  @Expose()
  public readonly pending_url: string;

  @IsString()
  @Expose()
  public readonly failure_url: string;

  @IsString()
  @Expose()
  public readonly cancel_url: string;

  @IsString()
  @Expose()
  public readonly notice_url: string;

  @IsString()
  @Expose()
  public readonly x_frame_host: string;

  @IsString()
  @Expose()
  public readonly plugin_version: string;
}
