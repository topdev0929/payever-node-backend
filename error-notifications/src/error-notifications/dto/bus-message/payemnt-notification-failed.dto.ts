import { IsString, IsNumber, IsDate, IsDefined } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class PaymentNotificationFailedEventDto {
  @Expose()
  @IsDefined()
  @IsString()
  public businessId: string;

  @Expose()
  @IsDefined()
  @IsNumber()
  public deliveryAttempts: number;

  @Expose()
  @IsDate()
  @Transform((value: string) => { if (value) { return new Date(value); } }, { toClassOnly: true })
  public firstFailure: Date;

  @Expose()
  @IsDefined()
  @IsString()
  public noticeUrl: string;

  @Expose()
  @IsDefined()
  @IsString()
  public paymentId: string;

  @Expose()
  @IsDefined()
  @IsNumber()
  public statusCode: number;
}
