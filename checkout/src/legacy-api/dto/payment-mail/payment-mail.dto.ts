import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class PaymentMailDto {
  @IsString()
  @Expose()
  public to: string;

  @IsString()
  @Expose()
  public locale?: string = 'en';

  @IsString()
  @Expose()
  public templateName: string;

  @IsString()
  @Expose()
  public subject?: string;

  @Expose()
  public variables: {
    redirectUrl?: string;
    orderId?: string;
    businessName?: string;
    pin?: number;
    emailContent?: string;
  };
}
